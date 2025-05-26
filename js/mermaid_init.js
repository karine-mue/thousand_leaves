document.addEventListener('DOMContentLoaded', function () {
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: true });
  }
});
// This script initializes Mermaid when the DOM is fully loaded.
// It checks if the Mermaid library is available and then calls the initialize method.