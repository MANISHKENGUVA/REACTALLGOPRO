import React, { useMemo, useState } from "react";
import {
  AUBUTTON,
  AUCARD,
  AUCHIP,
  AUINPUT,
  AUSELECT,
  AUTEXTAREA,
  AUDATEPICKER,
  AURANGE,
  AUCHECKBOX,
  AURADIO,
  AUTOGGLE,
  AULISTGROUP,
  AUTIMELINE,
  AUMENU,
  AUPAGINATION,
  AUPROGRESS,
  AUMODAL,
  AUTOAST,
  AUTOOLTIP,
  AUPOPOVER,
  AUSTEPPER,
} from "./routerEngine";

const timelineItems = [
  { id: 1, title: "Kickoff", description: "Prototype approved", timestamp: "06/01", status: "completed" },
  { id: 2, title: "Review", description: "QA pass for variants", timestamp: "06/02", status: "pending", icon: "🧪" },
  { id: 3, title: "Release", description: "Docs route ready", timestamp: "06/03", status: "pending" },
];

const listItems = [
  { id: "a", title: "Overview", description: "Summary of the library", icon: "📊", badge: "Docs" },
  { id: "b", title: "States", description: "Disabled, selected, error, loading", icon: "⚙️" },
  { id: "c", title: "Feedback", description: "Tooltips, toasts, progress", icon: "💬", badge: "Live" },
];

const selectOptions = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

const stepperItems = [
  { label: "Brief", description: "Collect requirements" },
  { label: "Design", description: "Refine visuals and tokens" },
  { label: "Ship", description: "Launch and validate" },
];

export default function ComponentDocsPage() {
  const [selected, setSelected] = useState(["a"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("premium");
  const [toggleOn, setToggleOn] = useState(true);
  const [page, setPage] = useState(2);

  const pageLabel = useMemo(() => `Page ${page} of 5`, [page]);

  return (
    <div style={{ display: "grid", gap: "1.25rem", padding: "24px", background: "linear-gradient(180deg, #F5F7FF 0%, #FFFFFF 100%)", minHeight: "100vh" }}>
      <AUCARD>
        <div style={{ display: "grid", gap: "0.55rem" }}>
          <span style={{ display: "inline-flex", width: "fit-content", padding: "0.35rem 0.6rem", borderRadius: "999px", background: "#EEF2FF", color: "#4455E8", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Component test route</span>
          <h1 style={{ margin: 0, fontSize: "1.8rem", lineHeight: 1.2 }}>Documentation + prop-state playground</h1>
          <p style={{ margin: 0, color: "#3F4C89", maxWidth: "860px" }}>
            This page is the live reference for the ARTIUI components. Each section shows real prop combinations you can test, plus a quick state example for the key variants.
          </p>
        </div>
      </AUCARD>

      <AUCARD title="Buttons, chips & cards" description="Variants, disabled, rounded, loading, selected and default states.">
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <AUBUTTON variant="primary">primary</AUBUTTON>
            <AUBUTTON variant="secondary">secondary</AUBUTTON>
            <AUBUTTON variant="outline">outline</AUBUTTON>
            <AUBUTTON variant="ghost">ghost</AUBUTTON>
            <AUBUTTON variant="danger">danger</AUBUTTON>
            <AUBUTTON variant="link">link</AUBUTTON>
            <AUBUTTON variant="primary" rounded loading>loading</AUBUTTON>
            <AUBUTTON variant="primary" disabled>disabled</AUBUTTON>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <AUCHIP>default</AUCHIP>
            <AUCHIP selectable selected>selected</AUCHIP>
            <AUCHIP variant="success">success</AUCHIP>
            <AUCHIP variant="warning">warning</AUCHIP>
            <AUCHIP variant="danger" closable>danger</AUCHIP>
          </div>
          <p style={{ margin: 0, color: "#3F4C89", fontSize: "0.95rem" }}>
            Props shown here: variant, rounded, loading, disabled, selectable, selected, variant="success|warning|danger", closable.
          </p>
        </div>
      </AUCARD>

      <AUCARD title="Inputs & form controls" description="Label, placeholder, helper, error, clearable, icons, range and date input states.">
        <div style={{ display: "grid", gap: "1rem" }}>
          <AUINPUT id="doc-email" label="Email" placeholder="name@company.com" prefixIcon="✉️" suffixIcon="✓" helperText="Use a valid mailbox address" />
          <AUINPUT id="doc-password" label="Password" type="password" showPasswordToggle clearable placeholder="Enter password" />
          <AUINPUT id="doc-error" label="Error state" error="Validation failed" placeholder="Invalid value" />
          <AUSELECT id="doc-select" label="Select" options={selectOptions} helperText="Single-select variant" />
          <AUTEXTAREA id="doc-textarea" label="Notes" placeholder="Describe the change" helperText="Auto-resize is on" charCount maxLength={160} />
          <AUDATEPICKER id="doc-date" label="Start date" mode="date" helperText="Date input" />
          <AURANGE id="doc-range" label="Range control" tooltip min={0} max={100} value={72} />
        </div>
      </AUCARD>

      <AUCARD title="Selection, radios & toggles" description="Checked, indeterminate, disabled and active/inactive states.">
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <AUCHECKBOX id="doc-check" label="Enable premium styling" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <AUCHECKBOX id="doc-indet" label="Indeterminate example" indeterminate />
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <AURADIO id="premium" name="theme" label="Premium" checked={radioValue === "premium"} onChange={() => setRadioValue("premium")} />
            <AURADIO id="classic" name="theme" label="Classic" checked={radioValue === "classic"} onChange={() => setRadioValue("classic")} />
            <AURADIO id="dark" name="theme" label="Dark" disabled checked={false} />
          </div>
          <AUTOGGLE id="doc-toggle" label="Live preview" checked={toggleOn} onChange={(e) => setToggleOn(e.target.checked)} activeLabel="On" inactiveLabel="Off" />
        </div>
      </AUCARD>

      <AUCARD title="Lists, menus, progress & pagination" description="Selected state, menu items, progress bar and page navigation.">
        <div style={{ display: "grid", gap: "1rem" }}>
          <AULISTGROUP selectable selectedItems={selected} onSelectionChange={setSelected} items={listItems} />
          <AUMENU items={[{ label: "Profile", icon: "👤" }, { label: "Settings", icon: "⚙️" }, { label: "Logout", icon: "↩️" }]} />
          <AUPROGRESS variant="linear" value={68} showValue />
          <AUPROGRESS variant="circular" value={82} showValue />
          <AUPAGINATION currentPage={page} totalPages={5} onPageChange={setPage} />
          <p style={{ margin: 0, color: "#3F4C89", fontSize: "0.95rem" }}>Current page label: {pageLabel}</p>
        </div>
      </AUCARD>

      <AUCARD title="Modal, tooltip, popover, toast & stepper" description="Open/close, hover/focus feedback, toast, and multi-step progress.">
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <AUBUTTON variant="primary" onClick={() => setModalOpen(true)}>Open modal</AUBUTTON>
            <AUPOPOVER content="Popover content for hover or click"><AUBUTTON variant="outline">Popover</AUBUTTON></AUPOPOVER>
            <AUTOOLTIP content="Tooltip text" position="top"><AUBUTTON variant="secondary">Tooltip</AUBUTTON></AUTOOLTIP>
          </div>
          <AUSTEPPER steps={stepperItems.map((step, index) => ({ id: index + 1, title: step.label, description: step.description }))} activeStep={1} />
          {toastVisible ? <AUTOAST message="This is a live toast example" variant="info" onClose={() => setToastVisible(false)} /> : null}
          <AUMODAL isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Component test modal" footer={true} confirmText="Save" cancelText="Close">
            <p style={{ margin: 0, color: "#3F4C89" }}>Use this test modal to verify spacing, overlay, and footer actions.</p>
          </AUMODAL>
        </div>
      </AUCARD>

      <AUCARD title="Timeline + sample props reference" description="These are the main props to test when wiring each component into your page.">
        <div style={{ display: "grid", gap: "0.8rem" }}>
          <ul style={{ margin: 0, paddingLeft: "1rem", color: "#3F4C89", display: "grid", gap: "0.35rem" }}>
            <li>AUBUTTON: variant, rounded, loading, disabled, iconLeft, iconRight</li>
            <li>AUCARD: title, description, footer, className, style</li>
            <li>AUCHIP: variant, selectable, selected, closable</li>
            <li>AUINPUT: label, type, prefixIcon, suffixIcon, clearable, showPasswordToggle, error, helperText</li>
            <li>AUSELECT: options, searchable, multiple, checkbox, loading, error, helperText</li>
            <li>AUTEXTAREA: maxLength, charCount, autoResize, error, helperText</li>
            <li>AUDATEPICKER: mode="date|datetime|time", range, error, helperText</li>
            <li>AURANGE: range, tooltip, min, max, step, error</li>
            <li>AUCHECKBOX / AURADIO / AUTOGGLE: checked, disabled, indeterminate, activeLabel, inactiveLabel</li>
            <li>AULISTGROUP / AUTIMELINE / AUPAGINATION / AUPROGRESS / AUSTEPPER: selectedItems, items, currentPage, totalPages, value, type</li>
          </ul>
        </div>
      </AUCARD>
    </div>
  );
}
