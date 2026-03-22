// Achievements specific initializations

(function() {
  'use strict';
  
  function initAchAnimations() {
    if (typeof gsap === 'undefined') return;

    // 100M Reveal on Titles
    const achTitles = document.querySelectorAll('.ach-title');
    achTitles.forEach(title => {
      // Find the two lines
      const nodes = Array.from(title.childNodes);
      title.innerHTML = '';
      nodes.forEach(node => {
        if (node.nodeType === 3) { // Text node
          const spanWrapper = document.createElement('span');
          spanWrapper.style.display = 'inline-block';
          spanWrapper.style.overflow = 'hidden';
          spanWrapper.style.verticalAlign = 'top';

          const spanInner = document.createElement('span');
          spanInner.style.display = 'inline-block';
          spanInner.style.transform = 'translateY(110%)';
          spanInner.innerText = node.textContent;

          spanWrapper.appendChild(spanInner);
          title.appendChild(spanWrapper);
        } else {
          title.appendChild(node);
          if (node.tagName === 'SPAN') {
            node.style.display = 'inline-block';
            node.style.overflow = 'hidden';
            node.style.verticalAlign = 'top';
            
            // wrap inner content
            const innerContent = node.innerHTML;
            node.innerHTML = '';
            
            const spanInner = document.createElement('span');
            spanInner.style.display = 'inline-block';
            spanInner.style.transform = 'translateY(110%)';
            spanInner.innerHTML = innerContent;
            node.appendChild(spanInner);
          }
        }
      });
      
      gsap.to(title.querySelectorAll('span > span, span.text-serif > span'), {
        y: '0%',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 95%'
        }
      });
    });

    const achHeaders = document.querySelectorAll('.ach-meta, .ach-date');
    achHeaders.forEach(el => {
      gsap.fromTo(el, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        }
      });
    });

    // Image wrapper reveal
    const wrappers = document.querySelectorAll('.ach-img-wrap, .ach-video-wrap');
    wrappers.forEach(wrap => {
      // Create a mask overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'var(--bg)';
      overlay.style.zIndex = '2';
      wrap.appendChild(overlay);

      gsap.to(overlay, {
        height: '0%',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 80%'
        }
      });
      
      const img = wrap.querySelector('img, video');
      if (img) {
        // 1B+ Museum Depth Parallax: Staggered randomized scrub
        const prlxVal = Math.floor(Math.random() * 15) + 10;
        gsap.set(img, { yPercent: 5 }); // start slightly lower
        
        gsap.to(img, {
          yPercent: -prlxVal,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAchAnimations, 200);
  });
})();
