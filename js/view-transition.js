// Check browser support for cross-document view transitions
function supportsViewTransitions() {
  return 'startViewTransition' in document && 
         CSS.supports('view-transition-name', 'none') &&
         'navigation' in window;
}

// Dynamic view transition names using direct style properties
function setupViewTransitionNames() {
  console.log('🔄 Setting up dynamic view transition names...');
  
  document.querySelectorAll('[data-project]').forEach(element => {
    const project = element.dataset.project;
    if (project) {
      // Set view-transition-name for the container element
      element.style.viewTransitionName = `${project}-container`;
      console.log(`✅ Container: ${project}-container assigned to`, element);
      
      // Find and set view-transition-name for image elements
      const imageSelectors = [
        'img[slot="media"]',
        '.icon-placeholder',
        'img',
        '.thumbnail'
      ];
      
      let imageElement = null;
      for (const selector of imageSelectors) {
        imageElement = element.querySelector(selector);
        if (imageElement) break;
      }
      
      if (imageElement) {
        imageElement.style.viewTransitionName = `${project}-image`;
        console.log(`✅ Image: ${project}-image assigned to`, imageElement);
      }
      
      // Find and set view-transition-name for title elements
      const titleSelectors = [
        '.title',
        '.heading',
        'h1',
        'h2'
      ];
      
      let titleElement = null;
      for (const selector of titleSelectors) {
        titleElement = element.querySelector(selector);
        if (titleElement) break;
      }
      
      if (titleElement) {
        titleElement.style.viewTransitionName = `${project}-title`;
        console.log(`✅ Title: ${project}-title assigned to`, titleElement);
      }
      
      console.log(`✅ Setup complete for project: ${project}`);
    }
  });
  
  console.log('🎯 Dynamic view transition setup complete');
}

// Check browser support and log status
if (supportsViewTransitions()) {
  console.log('✅ Cross-document view transitions supported - using dynamic view-transition-name assignment');
} else {
  console.log('❌ Cross-document view transitions not supported - graceful fallback');
}

// Set up view transition names on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupViewTransitionNames);
} else {
  setupViewTransitionNames();
}

// Debug function to check current transition names
function debugViewTransitionNames() {
  console.log('🔍 View Transition Names Set via JavaScript:');
  
  // Check all elements with view-transition-name style property
  document.querySelectorAll('[style*="view-transition-name"]').forEach(el => {
    const name = el.style.viewTransitionName;
    const project = el.closest('[data-project]')?.dataset.project || 'unknown';
    console.log(`   - ${name}:`, { project, element: el });
  });
  
  // Also check all data-project containers
  console.log('🔍 Data-project containers:');
  document.querySelectorAll('[data-project]').forEach(el => {
    const project = el.dataset.project;
    const containerName = el.style.viewTransitionName;
    
    // Find child elements with transition names
    const children = el.querySelectorAll('[style*="view-transition-name"]');
    const childNames = Array.from(children).map(child => child.style.viewTransitionName);
    
    console.log(`   - ${project}:`, {
      container: containerName,
      children: childNames,
      element: el
    });
  });
}

// Make debug function available globally for manual testing
window.debugViewTransitionNames = debugViewTransitionNames;