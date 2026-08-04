/**
 * OpportunityX Resume — AI Request Queue Architecture
 * Manages request lifecycle states: Queued, Processing, Completed, Cancelled, Failed, Retry, Timeout.
 */

export class AIRequestQueue {
  constructor() {
    this.queue = [];
    this.activeRequest = null;
  }

  enqueue(requestPayload) {
    const item = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      payload: requestPayload,
      status: 'Queued',
      timestamp: new Date().toISOString()
    };
    this.queue.push(item);
    return item;
  }

  getQueueStatus() {
    return {
      pendingCount: this.queue.filter((q) => q.status === 'Queued').length,
      activeRequest: this.activeRequest,
      queue: this.queue
    };
  }
}

export const globalAIRequestQueue = new AIRequestQueue();
