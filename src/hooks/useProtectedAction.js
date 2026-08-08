/**
 * OpportunityX Resume — useProtectedAction Hook
 *
 * Gates actions behind authentication. If the user is a guest,
 * opens the AuthModal and resumes the action after successful login.
 * If the user is authenticated, executes immediately.
 */
import { useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';

export function useProtectedAction() {
  const { isAuthenticated, user } = useAuth();
  const { setIsAuthOpen } = useResume();
  const pendingActionRef = useRef(null);
  const wasGuestRef = useRef(!isAuthenticated);

  // When user transitions from guest → authenticated, execute pending action
  useEffect(() => {
    if (isAuthenticated && wasGuestRef.current && pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      wasGuestRef.current = false;

      // Small delay to let the auth modal close and state settle
      setTimeout(() => {
        try {
          action();
        } catch (e) {
          console.warn('OpportunityX Resume: Pending action failed:', e);
        }
      }, 300);
    }

    wasGuestRef.current = !isAuthenticated;
  }, [isAuthenticated]);

  /**
   * Execute an action if authenticated, otherwise prompt login.
   * After successful login, the action is automatically resumed.
   *
   * @param {Function} action - The action to execute
   * @param {Object} options - Optional config
   * @param {string} options.reason - Reason shown in auth modal
   */
  const protectedAction = useCallback(
    (action, options = {}) => {
      if (isAuthenticated) {
        action();
      } else {
        pendingActionRef.current = action;
        setIsAuthOpen(true);
      }
    },
    [isAuthenticated, setIsAuthOpen]
  );

  return protectedAction;
}
