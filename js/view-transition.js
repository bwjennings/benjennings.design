// URLPattern Polyfill
if (!globalThis.URLPattern) {
    const URLPatternPolyfill = await import("https://esm.sh/urlpattern-polyfill");
    globalThis.URLPattern = URLPatternPolyfill.URLPattern;
}

// Path where this app is deployed. Adjust if deploying at a subdirectory
const basePath = '';

// Make sure browser has support
(() => {
    let shouldThrow = false;

    if (!window.navigation) {
        document.querySelector('.warning[data-reason="navigation-api"]').style.display = "block";
        shouldThrow = true;
    }

    if (!("CSSViewTransitionRule" in window)) {
        document.querySelector('.warning[data-reason="cross-document-view-transitions"]').style.display = "block";
        shouldThrow = true;
    }

    if (shouldThrow) {
        throw new Error('Browser is lacking support …');
    }

    console.log('✅ Cross-document view transitions supported');
})();

// Link click handler to trigger cross-document view transitions
function handleLinkClick(event) {
    const anchor = event.target.closest('a');
    if (!anchor || anchor.target || anchor.download) return;

    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) return;

    // Check if this is a navigation that should have a view transition
    const currentUrl = new URL(window.location.href);
    const isCardToDetail = isHomePage(currentUrl) && isProjectPage(url);
    const isDetailToCard = isProjectPage(currentUrl) && isHomePage(url);
    
    if (!isCardToDetail && !isDetailToCard) return;
    if (!window.navigation) return;

    event.preventDefault();
    
    console.log('🚀 Intercepted link click - starting view transition:', currentUrl.pathname, '→', url.pathname);
    
    // Start the cross-document view transition
    if (!document.startViewTransition) {
        console.warn('❌ document.startViewTransition not available');
        window.location.href = anchor.href;
        return;
    }

    document.startViewTransition(() => {
        // Use the Navigation API so the new page participates
        // in the cross-document view transition.
        return navigation.navigate(anchor.href);
    });
}

// Add click event listener
document.addEventListener('click', handleLinkClick);

// URL Pattern matching
const homePagePattern = new URLPattern(`${basePath}(/designs/)*`, window.origin);
const isHomePage = (url) => {
    const urlObj = typeof url === 'string' ? new URL(url) : url;
    return homePagePattern.exec(urlObj) || urlObj.pathname === '/' || urlObj.pathname === '/designs/';
}

const projectPagePattern = new URLPattern(`${basePath}/designs/:project/`, window.origin);
const isProjectPage = (url) => {
    const urlObj = typeof url === 'string' ? new URL(url) : url;
    return projectPagePattern.exec(urlObj);
}

const extractProjectNameFromUrl = (url) => {
    const urlObj = typeof url === 'string' ? new URL(url) : url;
    const match = projectPagePattern.exec(urlObj);
    const project = match?.pathname.groups.project;
    console.log(`🔍 Extracting project from URL: ${urlObj.pathname} → ${project}`);
    return project;
}

// Utility function to set temporary view transition names
const setTemporaryViewTransitionNames = async (entries, vtPromise) => {
    console.log('🎯 Setting temporary view transition names:', entries.map(([el, name]) => name));
    
    for (const [$el, name] of entries) {
        if ($el) {
            $el.style.viewTransitionName = name;
        }
    }

    await vtPromise;

    for (const [$el, name] of entries) {
        if ($el) {
            $el.style.viewTransitionName = '';
        }
    }
    
    console.log('🧹 Temporary view transition names cleaned up');
}

// OLD PAGE LOGIC - Handle outgoing navigation
window.addEventListener('pageswap', async (e) => {
    const targetPath = new URL(e.activation.entry.url).pathname;
    if (!targetPath.startsWith(basePath)) {
        e.viewTransition.skipTransition();
        return;
    }

    if (e.viewTransition) {
        const currentUrl = e.activation.from?.url ? new URL(e.activation.from.url) : new URL(window.location.href);
        const targetUrl = new URL(e.activation.entry.url);

        console.log('📤 Pageswap:', currentUrl.pathname, '→', targetUrl.pathname);

        // Going from project page to homepage
        // ~> The detail page elements are the ones!
        if (isProjectPage(currentUrl) && isHomePage(targetUrl)) {
            const project = extractProjectNameFromUrl(currentUrl);
            
            if (project) {
                const detailContainer = document.querySelector(`.post-header[data-project="${project}"]`);
                const detailImage = document.querySelector(`.post-header[data-project="${project}"] img, .post-header[data-project="${project}"] .icon-placeholder`);
                const detailTitle = document.querySelector(`.post-header[data-project="${project}"] .heading, .post-header[data-project="${project}"] h1`);

                // Set transition type for CSS animations
                document.documentElement.dataset.activeViewTransitionType = 'detail-to-card';

                setTemporaryViewTransitionNames([
                    [detailContainer, 'card-container'],
                    [detailImage, 'card-image'],
                    [detailTitle, 'card-title'],
                ].filter(([el]) => el), e.viewTransition.finished);
            }
        }

        // Going to project page
        // ~> The clicked card elements are the ones!
        if (isProjectPage(targetUrl)) {
            const project = extractProjectNameFromUrl(targetUrl);

            if (project) {
                const cardContainer = document.querySelector(`.card[data-project="${project}"]`);
                const cardImage = document.querySelector(`.card[data-project="${project}"] img[slot="media"], .card[data-project="${project}"] .icon-placeholder, .card[data-project="${project}"] img`);
                const cardTitle = document.querySelector(`.card[data-project="${project}"] .title, .card[data-project="${project}"] h1, .card[data-project="${project}"] h2`);

                // Set transition type for CSS animations
                document.documentElement.dataset.activeViewTransitionType = 'card-to-detail';

                setTemporaryViewTransitionNames([
                    [cardContainer, 'card-container'],
                    [cardImage, 'card-image'],
                    [cardTitle, 'card-title'],
                ].filter(([el]) => el), e.viewTransition.finished);
            }
        }
    }
});

// NEW PAGE LOGIC - Handle incoming navigation
window.addEventListener('pagereveal', async (e) => {
    if (!navigation.activation.from) return;
    const fromPath = new URL(navigation.activation.from.url).pathname;
    if (!fromPath.startsWith(basePath)) {
        e.viewTransition.skipTransition();
        return;
    }

    if (e.viewTransition) {
        const fromUrl = new URL(navigation.activation.from.url);
        const currentUrl = new URL(navigation.activation.entry.url);

        console.log('📥 Pagereveal:', fromUrl.pathname, '→', currentUrl.pathname);

        // Went from project page to homepage
        // ~> Set VT names on the relevant card in the list
        if (isProjectPage(fromUrl) && isHomePage(currentUrl)) {
            const project = extractProjectNameFromUrl(fromUrl);

            if (project) {
                // Try multiple selector strategies to find the card elements
                const cardContainer = document.querySelector(`.card[data-project="${project}"]`) || 
                                   document.querySelector(`#card-${project}`) ||
                                   document.querySelector(`a[href*="${project}"]`);
                
                const cardImage = document.querySelector(`.card[data-project="${project}"] img[slot="media"]`) ||
                                document.querySelector(`.card[data-project="${project}"] img`) ||
                                document.querySelector(`#card-${project}-image`) ||
                                (cardContainer && cardContainer.querySelector('img'));
                
                const cardTitle = document.querySelector(`.card[data-project="${project}"] .title`) ||
                                document.querySelector(`.card[data-project="${project}"] h1`) ||
                                document.querySelector(`#card-${project}-title`) ||
                                (cardContainer && cardContainer.querySelector('.title, h1'));
                
                console.log(`🔍 Looking for card elements for project: ${project}`);
                console.log('Card container:', cardContainer);
                console.log('Card image:', cardImage);
                console.log('Card title:', cardTitle);

                if (cardContainer) {
                    setTemporaryViewTransitionNames([
                        [cardContainer, 'card-container'],
                        [cardImage, 'card-image'],
                        [cardTitle, 'card-title'],
                    ].filter(([el]) => el), e.viewTransition.ready);
                    
                    console.log(`✅ Set view transition names for return to card: ${project}`);
                } else {
                    console.warn(`⚠️ Could not find card container for project: ${project}`);
                }
            }
        }

        // Went to project page
        // ~> Set VT names on the detail page elements
        if (isProjectPage(currentUrl)) {
            const project = extractProjectNameFromUrl(currentUrl);

            if (project) {
                const detailContainer = document.querySelector(`.post-header[data-project="${project}"]`);
                const detailImage = document.querySelector(`.post-header[data-project="${project}"] img, .post-header[data-project="${project}"] .icon-placeholder`);
                const detailTitle = document.querySelector(`.post-header[data-project="${project}"] .heading, .post-header[data-project="${project}"] h1`);

                setTemporaryViewTransitionNames([
                    [detailContainer, 'card-container'],
                    [detailImage, 'card-image'],
                    [detailTitle, 'card-title'],
                ].filter(([el]) => el), e.viewTransition.ready);
            }
        }
    }
});
