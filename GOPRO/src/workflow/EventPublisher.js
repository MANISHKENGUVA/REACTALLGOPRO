import { WorkflowClient } from './WorkflowClient';

// EventPublisher: publishes node events/data, then caller re-resolves.
// Never hard-codes transitions — backend response decides next node.
export const EventPublisher = {
  async publish({ sessionId, node = '', event = '', eventType = '', data = {}, formData = {}, workflowMetadata = {} } = {}) {
    if (!event && !eventType) throw new Error('EventPublisher.publish requires event/eventType');
    return WorkflowClient.publishEvent({ sessionId, node, event, eventType, data, formData, workflowMetadata });
  },
};
