import React from 'react';
import { AISettingsModal } from './AISettingsModal';

/**
 * OpportunityX Resume — BYOK / AI Settings Modal
 * Secure modal for reviewing active API key status, testing OpenRouter connectivity,
 * and configuring custom keys or preferred LLM models.
 */
export const BYOKSettingsModal = (props) => {
  return <AISettingsModal {...props} />;
};

export default BYOKSettingsModal;
