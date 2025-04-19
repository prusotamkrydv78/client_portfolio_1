// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  // Cursor implementation with smooth following
  const cursorContainer = document.querySelector('.cursor-container');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  const cursorCircleOuter = document.querySelector('.cursor-circle-outer');

  if (cursorContainer) {
    // Mouse position variables
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let circleX = 0;
    let circleY = 0;
    let outerX = 0;
    let outerY = 0;

    // Smoothing factors (lower = smoother but more lag)
    const containerSmoothing = 0.2;  // Main container smoothing (faster)
    const circleSmoothing = 0.15;    // Inner circle follows first (medium speed)
    const outerSmoothing = 0.08;     // Outer circle follows last (slowest)

    // Elasticity factors (higher = more overshoot)
    const circleElasticity = 0.5;    // How much the inner circle overshoots (medium)
    const outerElasticity = 0.8;     // How much the outer circle overshoots (high)

    // Previous positions for calculating momentum
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseSpeedX = 0;
    let mouseSpeedY = 0;

    // Show cursor after a short delay
    setTimeout(() => {
      cursorContainer.style.opacity = '1';

      // Initialize all positions to avoid jumps
      cursorX = mouseX;
      cursorY = mouseY;
      circleX = mouseX;
      circleY = mouseY;
      outerX = mouseX;
      outerY = mouseY;
      cursorContainer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      // Set initial cursor color to Wave mode (yellow)
      cursorCircle.style.borderColor = 'rgba(255, 255, 100, 0.8)';
      cursorCircle.style.background = 'rgba(255, 255, 100, 0.1)';
      cursorDot.style.backgroundColor = 'rgba(255, 255, 100, 0.9)';
      cursorCircleOuter.style.borderColor = 'rgba(255, 255, 100, 0.5)';
      cursorCircleOuter.style.background = 'rgba(255, 255, 100, 0.05)';
    }, 500);

    // Track mouse position and calculate speed
    document.addEventListener('mousemove', (e) => {
      // Calculate mouse speed (distance moved since last event)
      mouseSpeedX = e.clientX - mouseX;
      mouseSpeedY = e.clientY - mouseY;

      // Update previous and current positions
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dispatch a custom event for Three.js to use
      const event = new CustomEvent('cursor-move', {
        detail: { x: e.clientX, y: e.clientY }
      });
      document.dispatchEvent(event);
    });

    // Smooth animation function with elastic overshooting
    function animateCursor() {
      // Calculate distance between current cursor position and target mouse position
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;

      // Update container position with smoothing
      cursorX += distX * containerSmoothing;
      cursorY += distY * containerSmoothing;

      // Calculate momentum-based target positions with overshoot
      // The faster the mouse moves, the more overshoot we apply
      const speedFactor = 0.4; // How much speed affects overshoot (increased for more noticeable effect)

      // Inner circle follows cursor directly with slight elasticity
      // This makes the smaller circle follow first
      const circleDistX = cursorX - circleX;
      const circleDistY = cursorY - circleY;

      // Add slight overshoot based on mouse speed
      const circleTargetX = cursorX + (mouseSpeedX * speedFactor * circleElasticity);
      const circleTargetY = cursorY + (mouseSpeedY * speedFactor * circleElasticity);

      // Move toward target with smoothing
      circleX += ((circleTargetX - circleX) * circleSmoothing);
      circleY += ((circleTargetY - circleY) * circleSmoothing);

      // When cursor stops, add slight overshoot and return effect
      if (Math.abs(mouseSpeedX) < 0.1 && Math.abs(mouseSpeedY) < 0.1) {
        // Gradually return to center when stopped
        circleX = circleX * 0.9 + cursorX * 0.1;
        circleY = circleY * 0.9 + cursorY * 0.1;
      }

      // Outer circle follows the inner circle with more delay
      // This ensures the larger circle trails behind the smaller one
      const outerDistX = circleX - outerX;
      const outerDistY = circleY - outerY;

      // Add even more overshoot for outer circle
      const outerTargetX = circleX + (mouseSpeedX * speedFactor * outerElasticity);
      const outerTargetY = circleY + (mouseSpeedY * speedFactor * outerElasticity);

      // Move toward target with more smoothing (slower)
      outerX += ((outerTargetX - outerX) * outerSmoothing);
      outerY += ((outerTargetY - outerY) * outerSmoothing);

      // When cursor stops, add more pronounced return effect for outer circle
      if (Math.abs(mouseSpeedX) < 0.1 && Math.abs(mouseSpeedY) < 0.1) {
        // Gradually return to inner circle position when stopped
        outerX = outerX * 0.95 + circleX * 0.05;
        outerY = outerY * 0.95 + circleY * 0.05;
      }

      // Apply the transforms
      cursorContainer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      cursorCircle.style.transform = `translate(${circleX - cursorX}px, ${circleY - cursorY}px) translate(-50%, -50%)`;
      cursorCircleOuter.style.transform = `translate(${outerX - cursorX}px, ${outerY - cursorY}px) translate(-50%, -50%)`;

      // Continue the animation loop
      requestAnimationFrame(animateCursor);
    }

    // Start the animation loop
    animateCursor();

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .social-icon');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorCircle.classList.add('hover');
        cursorCircleOuter.classList.add('hover');
      });

      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorCircle.classList.remove('hover');
        cursorCircleOuter.classList.remove('hover');
      });
    });

    // Update cursor appearance based on interaction mode
    let currentMode = 0;
    setInterval(() => {
      // Check if the mode indicator exists to get current mode
      const modeIndicator = document.querySelector('div[style*="position: fixed"][style*="bottom: 20px"]');
      if (modeIndicator) {
        const modeText = modeIndicator.textContent;
        if (modeText.includes('Repel')) currentMode = 0;
        else if (modeText.includes('Attract')) currentMode = 1;
        else if (modeText.includes('Vortex')) currentMode = 2;
        else if (modeText.includes('Wave')) currentMode = 3;

        // Update cursor appearance based on mode
        switch(currentMode) {
          case 0: // Repel
            cursorCircle.style.borderColor = 'rgba(255, 100, 100, 0.8)';
            cursorCircle.style.background = 'rgba(255, 100, 100, 0.1)';
            cursorDot.style.backgroundColor = 'rgba(255, 100, 100, 0.9)';
            cursorCircleOuter.style.borderColor = 'rgba(255, 100, 100, 0.5)';
            cursorCircleOuter.style.background = 'rgba(255, 100, 100, 0.05)';
            break;
          case 1: // Attract
            cursorCircle.style.borderColor = 'rgba(100, 255, 100, 0.8)';
            cursorCircle.style.background = 'rgba(100, 255, 100, 0.1)';
            cursorDot.style.backgroundColor = 'rgba(100, 255, 100, 0.9)';
            cursorCircleOuter.style.borderColor = 'rgba(100, 255, 100, 0.5)';
            cursorCircleOuter.style.background = 'rgba(100, 255, 100, 0.05)';
            break;
          case 2: // Vortex
            cursorCircle.style.borderColor = 'rgba(100, 100, 255, 0.8)';
            cursorCircle.style.background = 'rgba(100, 100, 255, 0.1)';
            cursorDot.style.backgroundColor = 'rgba(100, 100, 255, 0.9)';
            cursorCircleOuter.style.borderColor = 'rgba(100, 100, 255, 0.5)';
            cursorCircleOuter.style.background = 'rgba(100, 100, 255, 0.05)';
            break;
          case 3: // Wave
            cursorCircle.style.borderColor = 'rgba(255, 255, 100, 0.8)';
            cursorCircle.style.background = 'rgba(255, 255, 100, 0.1)';
            cursorDot.style.backgroundColor = 'rgba(255, 255, 100, 0.9)';
            cursorCircleOuter.style.borderColor = 'rgba(255, 255, 100, 0.5)';
            cursorCircleOuter.style.background = 'rgba(255, 255, 100, 0.05)';
            break;
        }
      }
    }, 100);
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
