document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('menu-button');
  const closeButton = document.getElementById('menu-close-button');
  const body = document.body;

  if (menuButton && mobileMenu && closeButton) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      body.classList.add('mobile-menu-open');
      trapFocus(mobileMenu);
    });

    closeButton.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      body.classList.remove('mobile-menu-open');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        body.classList.remove('mobile-menu-open');
        menuButton.focus();
      }
    });

    function trapFocus(element) {
      const focusableElements = element.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        }
      });

      firstFocusableElement.focus();
    }
  }

  // Smooth Scroll & Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.getElementById('back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update URL (optional)
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const sliderContainer = document.querySelector('.testimonial-slider');
  if (sliderContainer) {
      const slides = sliderContainer.querySelectorAll('.testimonial-slide');
      const prevButton = sliderContainer.querySelector('.slider-prev');
      const nextButton = sliderContainer.querySelector('.slider-next');
      let currentSlide = 0;
      let intervalId;

      function showSlide(index) {
          slides.forEach((slide, i) => {
              slide.style.display = i === index ? 'block' : 'none';
          });
      }

      function nextSlide() {
          currentSlide = (currentSlide + 1) % slides.length;
          showSlide(currentSlide);
      }

      function prevSlide() {
          currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(currentSlide);
      }

      function startSlider() {
          intervalId = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
      }

      function stopSlider() {
          clearInterval(intervalId);
      }

      if (prevButton) {
          prevButton.addEventListener('click', () => {
              stopSlider();
              prevSlide();
              startSlider();
          });
      }

      if (nextButton) {
          nextButton.addEventListener('click', () => {
              stopSlider();
              nextSlide();
              startSlider();
          });
      }

      showSlide(currentSlide);
      startSlider();

      sliderContainer.addEventListener('mouseenter', stopSlider);
      sliderContainer.addEventListener('mouseleave', startSlider);

  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('open');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Email Capture Validation
  const emailForm = document.getElementById('email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const email = emailInput.value;

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Email submitted:', email);
      // Simulate sending to server
      setTimeout(() => {
        alert('Thank you for subscribing!');
        emailInput.value = ''; // Clear the input
      }, 500);

    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA Click Logging
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const utmParams = getUtmParams();
      console.log('CTA Clicked with UTM:', utmParams);
      // You would typically send this data to an analytics server here.
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent
    };
  }

  // Defer image loading
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => {
      img.removeAttribute('data-src');
    };
  });
});