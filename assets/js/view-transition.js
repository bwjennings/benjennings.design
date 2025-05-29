// function getSlug(pathname) {
//   const segments = pathname.split('/').filter(Boolean);
//   let last = segments.pop() || '';
//   if (last === 'index.html') last = segments.pop() || 'index';
//   return last.replace(/\.html$/, '');
// }

// function isDesignList(url) {
//   return url ? url.endsWith('/designs.html') : false;
// }

// function isDesignDetail(url) {
//   return /\/designs\/[^/]+\.html$/.test(url || '');
// }

// window.addEventListener('pageswap', async (e) => {
//   if (!e.viewTransition) return;

//   const currentUrl = e.activation.from?.url
//     ? new URL(e.activation.from.url)
//     : null;
//   const targetUrl = new URL(e.activation.entry.url);

//   // Leaving a design detail page back to the list
//   if (isDesignDetail(currentUrl?.pathname) && isDesignList(targetUrl.pathname)) {
//     const container =
//       document.querySelector('.page-detail') || document.querySelector('main');
//     if (container) {
//       container.style.viewTransitionName = 'detail';
//     }

//     await e.viewTransition.finished;

//     if (container) {
//       container.style.viewTransitionName = 'none';
//     }
//   }

//   // Navigating to a design detail page
//   if (isDesignDetail(targetUrl.pathname)) {
//     const slug = getSlug(targetUrl.pathname);
//     const card = document.querySelector(
//       `.page-items a.card[href$='${slug}.html']`
//     );
//     if (card) {
//       card.style.viewTransitionName = 'detail';
//     }

//     await e.viewTransition.finished;

//     if (card) {
//       card.style.viewTransitionName = 'none';
//     }
//   }
// });

// window.addEventListener('pagereveal', async (e) => {
//   // If the "from" entry doesn't exist, abort
//   if (!e.activation.from) return;
//   if (!e.viewTransition) return;

//   const fromUrl = new URL(e.activation.from.url);
//   const currentUrl = new URL(e.activation.entry.url);

//   // Arrived at the list from a detail page
//   if (isDesignDetail(fromUrl.pathname) && isDesignList(currentUrl.pathname)) {
//     const slug = getSlug(fromUrl.pathname);
//     const card = document.querySelector(
//       `.page-items a.card[href$='${slug}.html']`
//     );
//     if (card) {
//       card.style.viewTransitionName = 'detail';
//     }

//     await e.viewTransition.ready;

//     if (card) {
//       card.style.viewTransitionName = 'none';
//     }
//   }

//   // Arrived at a design detail page
//   if (isDesignDetail(currentUrl.pathname)) {
//     const container =
//       document.querySelector('.page-detail') || document.querySelector('main');
//     if (container) {
//       container.style.viewTransitionName = 'detail';
//     }

//     await e.viewTransition.ready;

//     if (container) {
//       container.style.viewTransitionName = 'none';
//     }
//   }
// });

// // Intercept design page navigations to enable view transitions
// document.addEventListener('click', (e) => {
//   const link = e.target.closest('a');
//   if (!link) return;
//   const url = new URL(link.href, location.href);
//   // Only intercept design list/detail links
//   if (isDesignList(url.pathname) || isDesignDetail(url.pathname)) {
//     e.preventDefault();
//     document.startViewTransition(() => {
//       window.location.href = url.href;
//     });
//   }
// });
