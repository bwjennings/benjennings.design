/**
 * Minimal view transition helper.
 * Provides a basic support warning without complex navigation logic.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!('CSSViewTransitionRule' in window)) {
    console.warn('View transitions are not supported in this browser.');
  }
});
