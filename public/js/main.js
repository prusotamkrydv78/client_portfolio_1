// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  // Custom cursor animation
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');

  if (cursorDot && cursorCircle) {
    // Show cursors after a short delay to prevent initial flicker
    setTimeout(() => {
      cursorDot.style.opacity = '1';
      cursorCircle.style.opacity = '1';
    }, 500);

    // Variables for smooth animation
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let circleX = 0;
    let circleY = 0;

    // Smoothing factor (lower = smoother but more lag)
    const dotSmoothing = 0.2; // Fast following for the dot
    const circleSmoothing = 0.1; // Slower following for the circle

    // Update cursor positions with smooth animation
    const updateCursorPosition = () => {
      // Calculate new positions with smoothing
      dotX += (mouseX - dotX) * dotSmoothing;
      dotY += (mouseY - dotY) * dotSmoothing;
      circleX += (mouseX - circleX) * circleSmoothing;
      circleY += (mouseY - circleY) * circleSmoothing;

      // Apply new positions
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;

      // Continue animation loop
      requestAnimationFrame(updateCursorPosition);
    };

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dispatch a custom event for Three.js to use
      const event = new CustomEvent('cursor-move', {
        detail: { x: e.clientX, y: e.clientY }
      });
      document.dispatchEvent(event);
    });

    // Start animation loop
    updateCursorPosition();

    // Add interactive class to elements that should trigger cursor effects
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .social-icon');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.5)`;
        cursorDot.style.backgroundColor = 'var(--secondary-color)';
        cursorCircle.style.borderColor = 'var(--secondary-color)';
      });

      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        cursorDot.style.backgroundColor = 'var(--primary-color)';
        cursorCircle.style.borderColor = 'var(--primary-color)';
      });
    });
  }
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }

        // Scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
});
