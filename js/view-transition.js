// Path where this app is deployed. Adjust if deploying at a subdirectory
const basePath = '';

// Helper functions for page type detection
const isTopLevelPage = (pathname) => {
    const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
    return ['/', '/fundamentals/', '/designs/', '/experiments/', '/resources/'].includes(normalizedPath);
};

const isProjectPage = (pathname) => {
    // Match patterns like /designs/arvest/, /designs/dwellane/, etc.
    return /^\/designs\/[^\/]+\/?$/.test(pathname);
};

const isHomePage = (pathname) => {
    const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
    return normalizedPath === '/' || normalizedPath === '/designs/';
};

// Determine the View Transition class to use based on the old and new navigation entries
const determineTransitionType = (oldNavigationEntry, newNavigationEntry) => {
    if (!oldNavigationEntry || !newNavigationEntry) {
        return 'unknown';
    }

    const currentURL = new URL(oldNavigationEntry.url);
    const destinationURL = new URL(newNavigationEntry.url);

    const currentPathname = currentURL.pathname.replace(basePath, '');
    const destinationPathname = destinationURL.pathname.replace(basePath, '');

    console.log(`🔍 Transition: ${currentPathname} → ${destinationPathname}`);

    if (currentPathname === destinationPathname) {
        return "reload";
    }

    // Check for card-to-detail transitions (home/designs page → project page)
    if (isHomePage(currentPathname) && isProjectPage(destinationPathname)) {
        console.log(`🎯 Card-to-detail transition detected`);
        return 'card-to-detail';
    }

    // Check for detail-to-card transitions (project page → home/designs page)
    if (isProjectPage(currentPathname) && isHomePage(destinationPathname)) {
        console.log(`🎯 Detail-to-card transition detected`);
        return 'detail-to-card';
    }

    // Check for top-level page navigation
    if (isTopLevelPage(currentPathname) && isTopLevelPage(destinationPathname)) {
        // Map paths to navigation order: Home, Fundamentals, Designs, Experiments, Resources
        const getPageIndex = (pathname) => {
            const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
            switch (normalizedPath) {
                case '/': return 0;
                case '/fundamentals/': return 1;
                case '/designs/': return 2;
                case '/experiments/': return 3;
                case '/resources/': return 4;
                default: return -1;
            }
        };

        const currentPageIndex = getPageIndex(currentPathname);
        const destinationPageIndex = getPageIndex(destinationPathname);

        console.log(`🔍 Page indices: ${currentPageIndex} → ${destinationPageIndex}`);

        if (currentPageIndex === -1 || destinationPageIndex === -1) {
            return 'unknown';
        }

        if (currentPageIndex > destinationPageIndex) {
            return 'up';
        }
        if (currentPageIndex < destinationPageIndex) {
            return 'down';
        }
    }

    return 'unknown';
};

// Critical: Set up pagereveal listener IMMEDIATELY (before DOM loads)
window.addEventListener("pagereveal", async (e) => {
    console.log("🚨 PAGEREVEAL EVENT FIRED!", e);
    console.log("🚨 viewTransition object:", e.viewTransition);
    console.log("🚨 navigation.activation:", navigation.activation);
    
    if (e.viewTransition) {
        // Get transitionType from localStorage or derive it using the NavigationActivationInformation
        let transitionType;
        if (!window.navigation) {
            transitionType = localStorage.getItem("transitionType");
        } else {
            transitionType = determineTransitionType(navigation.activation.from, navigation.activation.entry);
        }

        console.log(`pageReveal: ${transitionType}`);
        e.viewTransition.types.add(transitionType);
    } else {
        console.log("🚨 NO VIEW TRANSITION OBJECT IN PAGEREVEAL");
    }
});

// URLPattern Polyfill - Load synchronously for immediate availability
if (!globalThis.URLPattern) {
    // For now, we'll skip the polyfill since it requires async import
    // Modern browsers should support URLPattern natively
    console.warn('URLPattern not available - some features may not work in older browsers');
}

// Make sure browser has support
document.addEventListener("DOMContentLoaded", (e) => {
    let shouldThrow = false;

    if (!window.navigation) {
        const warningElement = document.querySelector('.warning[data-reason="navigation-api"]');
        if (warningElement) {
            warningElement.style.display = "block";
        }
        shouldThrow = false;
    }

    if (!("CSSViewTransitionRule" in window)) {
        const warningElement = document.querySelector('.warning[data-reason="cross-document-view-transitions"]');
        if (warningElement) {
            warningElement.style.display = "block";
        }
        shouldThrow = true;
    }

    if (shouldThrow) {
        // Throwing here, to prevent the rest of the code from getting executed
        // If only JS (in the browser) had something like process.exit().
        throw new Error('Browser is lacking support …');
    }

    console.log('✅ Cross-document view transitions supported');
});

// Note: determining the types is typically needed only on the new page (thus: in `pagereveal`)
// However, because we set the `view-transition-names` based on the types (see CSS)
// we also determine it on the outgoing page.
window.addEventListener("pageswap", async (e) => {
    console.log("🚨 PAGESWAP EVENT FIRED!", e);
    console.log("🚨 viewTransition object:", e.viewTransition);
    console.log("🚨 activation:", e.activation);
    
    if (e.viewTransition) {

        // @TODO: If destination does not start with basePath, abort the VT

        const transitionType = determineTransitionType(e.activation.from, e.activation.entry);
        console.log(`pageSwap: ${transitionType}`);
        e.viewTransition.types.add(transitionType);

        // Persist transitionType for browsers that don't have the Navigation API
        if (!window.navigation) {
            localStorage.setItem("transitionType", transitionType);
        }
    } else {
        console.log("🚨 NO VIEW TRANSITION OBJECT IN PAGESWAP");
    }
});