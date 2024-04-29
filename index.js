document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const url = this.getAttribute('data-target'); // Assuming data-target contains the URL
      const direction = this.getAttribute('data-direction'); // 'left' or 'right'
      transitionTo(url, direction);
    });
  });
  
  async function transitionTo(url, direction) {
    if (!document.createDocumentTransition) {
      window.location.href = url;
      return;
    }
  
    const transition = document.createDocumentTransition();
    await transition.start(() => {
      fetch(url)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const newContent = doc.querySelector('.main-content');
          
          // Apply direction-based classes for slide animations
          newContent.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
          const currentContent = document.querySelector('.main-content');
          currentContent.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
  
          document.querySelector('main').appendChild(newContent);
          setTimeout(() => {
            currentContent.remove();
            newContent.classList.remove('slide-in-right', 'slide-in-left');
          }, 300); // Ensure this matches your CSS animation duration
        });
    });
  }
  

  