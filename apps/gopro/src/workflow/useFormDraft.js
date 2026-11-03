import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_DRAFT_PERSISTENCE_ENABLED,
  DEFAULT_DRAFT_TTL_MS,
  DraftStore,
} from './DraftStore';

// useFormDraft: draft save / restore for one workflow step.
//
// Lifecycle
// ---------
// 1. Mount: a draft for (workflowId, stateId, actor) is restored once and the
//    form initialises from it; otherwise initialValues are used.
// 2. Edit: setValues() accepts both a value and the functional updater form
//    used across the existing pages (setFormData(prev => ({ ...prev, [k]: v }))).
//    Changes are persisted with a small debounce so every keystroke does not
//    hammer sessionStorage.
// 3. Leave: the debounce is flushed on unmount / dependency change, so a quick
//    "Save and continue" still persists the latest field values.
// 4. Submit: the page calls clearDraft() once the backend accepted the event,
//    which both removes the stored draft and stops any further saves for it.
//
// Isolation
// ---------
// The key includes the workflow ID and the actor-qualified state ID, so drafts
// can never leak between workflows, steps or actors. Drafts are plain text only
// (binary inputs are stripped by DraftStore); the backend owns upload state.
export function useFormDraft({
  workflowId = '',
  actor = '',
  stateId = '',
  initialValues = {},
  enabled = DEFAULT_DRAFT_PERSISTENCE_ENABLED,
  saveDelayMs = 350,
  ttlMs = DEFAULT_DRAFT_TTL_MS,
} = {}) {
  const canPersist = Boolean(enabled && workflowId && stateId);

  // Used only to flag restoration without invoking setState during render.
  const restoredFlagRef = useRef(false);
  // The page has submitted this step: stop persisting from now on.
  const clearedRef = useRef(false);

  const [restored, setRestored] = useState(false);
  const [values, setValuesState] = useState(() => {
    if (!canPersist) return initialValues;
    const draft = DraftStore.loadDraft({ workflowId, stateId, actor });
    if (draft) {
      restoredFlagRef.current = true;
      return draft.values;
    }
    return initialValues;
  });

  const setValues = useCallback((nextOrUpdater) => {
    setValuesState((prev) => (
      typeof nextOrUpdater === 'function' ? nextOrUpdater(prev) : nextOrUpdater
    ));
  }, []);

  // Debounced persistence. The cleanup flushes the pending snapshot, so an
  // unmount (navigation) never drops the last edits.
  useEffect(() => {
    if (!canPersist || clearedRef.current) return undefined;
    if (JSON.stringify(values) === JSON.stringify(initialValues)) return undefined;
    const snapshot = values;
    const timer = setTimeout(() => {
      DraftStore.saveDraft({ workflowId, stateId, actor, values: snapshot, ttlMs });
    }, saveDelayMs);
    return () => {
      clearTimeout(timer);
      if (!clearedRef.current) {
        DraftStore.saveDraft({ workflowId, stateId, actor, values: snapshot, ttlMs });
      }
    };
  }, [values, canPersist, workflowId, stateId, actor, saveDelayMs, ttlMs, initialValues]);

  // Reflect the restore flag after the first paint.
  useEffect(() => {
    if (restoredFlagRef.current) {
      setRestored(true);
      restoredFlagRef.current = false;
    }
  }, []);

  const clearDraft = useCallback(() => {
    clearedRef.current = true;
    if (workflowId && stateId) DraftStore.clearDraft({ workflowId, stateId });
  }, [workflowId, stateId]);

  return {
    values,
    setValues,
    clearDraft,
    restored,
    hasDraft: restored,
  };
}
