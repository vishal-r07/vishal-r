/* ═══════════════════════════════════════════════════════
 *  VISHAL MEYYAPPAN R — Premium Interaction Engine
 *  Lenis + GSAP ScrollTrigger
 * ═══════════════════════════════════════════════════════ */
(function() {
  'use strict';
  
  // Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ─── LENIS SMOOTH SCROLL ───
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    
    lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // ─── UTILS: SPLIT TEXT ───
  // Custom simple text splitter since we don't have GSAP SplitText premium plugin
  function splitTextForScrub(element) {
    if (!element) return;
    const text = element.textContent;
    element.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');
      wordSpan.innerHTML = `${word}<span class="word-inner">${word}</span>`;
      element.appendChild(wordSpan);
    });
  }

  // ─── ANIMATIONS ───
  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    // 1. Preloader
    const preloaderTextSpans = document.querySelectorAll('.preloader-text span');
    const tlPreloader = gsap.timeline({
      onComplete: () => {
        gsap.to('.preloader', { 
          yPercent: -100, 
          duration: 1.2, 
          ease: 'power4.inOut',
          delay: 0.2
        });
      }
    });

    if (preloaderTextSpans.length) {
      tlPreloader.to(preloaderTextSpans, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      })
      .to(preloaderTextSpans, {
        yPercent: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.in',
        delay: 0.5
      });
    } else {
      gsap.to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' });
    }

    // 2. Hero Parallax
    gsap.to('.hero-content', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 3. Statement Scrub Reveal
    const statement = document.querySelector('.statement-text');
    if (statement) {
      splitTextForScrub(statement);
      const wordInners = statement.querySelectorAll('.word-inner');
      
      gsap.to(wordInners, {
        width: '100%',
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.statement',
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 1
        }
      });
    }

    // 4. (Removed Horizontal Scroll - Upgraded to Native CSS Sticky Stack)

    // 5. Statement Image Parallax
    const statementImg = document.querySelector('.statement-image-wrapper img');
    if (statementImg) {
      gsap.to(statementImg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.statement',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // 6. 100M/10 GSAP Reveals (Stagger + Skew)
    const fadeEls = gsap.utils.toArray('.reveal-fade');
    fadeEls.forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });

    // We can animate the text via a clip path reveal from bottom
    gsap.utils.toArray('.reveal-text').forEach((el) => {
      // Split into words for stagger effect if not already split
      const words = el.innerText.split(' ');
      el.innerHTML = '';
      words.forEach(word => {
        const spanWrapper = document.createElement('span');
        spanWrapper.style.display = 'inline-block';
        spanWrapper.style.overflow = 'hidden';
        spanWrapper.style.verticalAlign = 'top';
        
        const spanInner = document.createElement('span');
        spanInner.style.display = 'inline-block';
        spanInner.style.transform = 'translateY(110%)';
        spanInner.innerText = word + '\xA0';
        
        spanWrapper.appendChild(spanInner);
        el.appendChild(spanWrapper);
      });

      gsap.to(el.querySelectorAll('span > span'), {
        y: '0%',
        duration: 1.2,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%'
        }
      });
    });

    // Initialize metrics and experience fade
    const fadeElements = document.querySelectorAll('.metric-item, .experience-item, .skill-col, .footer-bottom');
    fadeElements.forEach(el => {
      gsap.fromTo(el, {
        y: 60,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // 7. Ultimate detailing: Custom Cyber Scramble
    const scrambleTags = document.querySelectorAll('.cyber-scramble');
    const chars = '!<>-_\\\\/[]{}—=+*^?#_XOXO';
    scrambleTags.forEach((el, index) => {
      const originalText = el.innerText.trim();
      el.innerText = '';
      
      setTimeout(() => {
        let frame = 0;
        const duration = 40;
        const interval = setInterval(() => {
          let scrambled = '';
          for (let i = 0; i < originalText.length; i++) {
            // Unscramble characters sequentially or randomly
            if (frame > (i / originalText.length) * duration && Math.random() > 0.3) {
              scrambled += originalText[i];
            } else {
              scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          el.innerText = scrambled;
          frame++;
          if (frame >= duration) {
            clearInterval(interval);
            el.innerText = originalText;
          }
        }, 40);
      }, index * 800 + 400); // stagger delays
    });

    // 8. Magnetic Physics DOM Nodes (1B+ detail)
    const magneticBtn = document.querySelector('.premium-btn-wrapper');
    if (magneticBtn) {
      magneticBtn.addEventListener('mousemove', (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        // Calculate distance from center of element
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(magneticBtn, {
          x: x * 0.2, // Strength of the magnetic pull
          y: y * 0.2,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
      magneticBtn.addEventListener('mouseleave', () => {
        // Elastic snap back to origin
        gsap.to(magneticBtn, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    }

  }

  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    initLenis();
    setTimeout(initAnimations, 100);
  });

})();
