

// Drawer Navigation Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const drawerToggle = document.querySelector('.btn-horizontal');
  const drawerWrapper = document.querySelector('.bl_drawerNav_wrapper');
  const drawerClose = document.querySelector('.bl_drawerClose');
  
  if (!drawerToggle || !drawerWrapper) {
    return;
  }
  
  // Toggle drawer when menu button is clicked
  drawerToggle.addEventListener('click', function(e) {
    e.preventDefault();
    drawerWrapper.classList.toggle('is-active');
  });
  
  // Close drawer when close button is clicked
  if (drawerClose) {
    drawerClose.addEventListener('click', function(e) {
      e.preventDefault();
      drawerWrapper.classList.remove('is-active');
    });
  }
});

// Event Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselWrapper = document.querySelector('.event-carousel-wrapper');
  const navLeft = document.querySelector('.carousel-nav.nav-left');
  const navRight = document.querySelector('.carousel-nav.nav-right');
  const eventCarousel = document.querySelector('.event-carousel');
  
  if (!carouselWrapper || !navLeft || !navRight || !eventCarousel) {
    console.error('Carousel elements not found');
    return;
  }
  
  // Verify buttons are found and accessible
  if (!navLeft || !navRight) {
    console.error('Navigation buttons not found');
    return;
  }
  
  // Get original slides
  let carouselImages = document.querySelectorAll('.carousel-event-image');
  const originalSlides = Array.from(carouselImages);
  const totalOriginalSlides = originalSlides.length;
  
  if (totalOriginalSlides === 0) {
    return;
  }
  
  // Clone first slide and append to end, clone last slide and prepend to beginning
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[totalOriginalSlides - 1].cloneNode(true);
  
  carouselWrapper.insertBefore(lastClone, originalSlides[0]);
  carouselWrapper.appendChild(firstClone);
  
  // Update slides reference after cloning
  carouselImages = document.querySelectorAll('.carousel-event-image');
  const totalSlides = carouselImages.length;
  
  // Start at index 1 (first real slide, after cloned last slide)
  let currentIndex = 1;
  let isTransitioning = false;
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 3000; // 3 seconds
  
  // Function to get slide width based on screen size
  function getSlideWidth() {
    const firstSlide = carouselImages[0];
    if (!firstSlide) return 434; // Default desktop width
    return firstSlide.offsetWidth || (window.innerWidth <= 620 ? 343 : 434);
  }
  
  // Function to update carousel position
  function updateCarousel(disableTransition = false) {
    if (isTransitioning) return;
    
    const slideWidth = getSlideWidth();
    const translateX = -currentIndex * slideWidth;
    
    if (disableTransition) {
      carouselWrapper.style.transition = 'none';
    } else {
      carouselWrapper.style.transition = 'transform 1s ease-in-out';
    }
    
    carouselWrapper.style.transform = `translateX(${translateX}px)`;
    
    // Enable buttons (circular loop, so buttons are always enabled)
    navLeft.style.opacity = '1';
    navLeft.style.cursor = 'pointer';
    navRight.style.opacity = '1';
    navRight.style.cursor = 'pointer';
  }
  
  // Function to handle seamless loop transition (bidirectional circular loop)
  function handleLoopTransition(direction) {
    // If we're at the cloned first slide (last position), jump to real first slide (forward)
    if (currentIndex === totalSlides - 1 && direction === 'forward') {
      setTimeout(function() {
        isTransitioning = true;
        carouselWrapper.style.transition = 'none';
        currentIndex = 1; // Jump back to first real slide
        updateCarousel(true);
        setTimeout(function() {
          carouselWrapper.style.transition = 'transform 1s ease-in-out';
          isTransitioning = false;
        }, 50);
      }, 1000); // Wait for transition animation to complete
    }
    // If we're at the cloned last slide (first position), jump to real last slide (backward)
    else if (currentIndex === 0 && direction === 'backward') {
      setTimeout(function() {
        isTransitioning = true;
        carouselWrapper.style.transition = 'none';
        currentIndex = totalOriginalSlides; // Jump to last real slide
        updateCarousel(true);
        setTimeout(function() {
          carouselWrapper.style.transition = 'transform 1s ease-in-out';
          isTransitioning = false;
        }, 50);
      }, 1000); // Wait for transition animation to complete
    }
  }
  
  // Function to go to next slide (slide right/forward: 1 → 2 → 3 → 1 → 2 → 3...)
  function nextSlide() {
    if (isTransitioning) return;
    
    currentIndex++;
    updateCarousel();
    
    // Check if we need to loop after transition completes
    // When we reach the cloned first slide, seamlessly jump back to real first slide
    if (currentIndex === totalSlides - 1) {
      handleLoopTransition('forward');
    }
  }
  
  // Function to go to previous slide (slide left/backward: 3 → 2 → 1 → 3 → 2 → 1...)
  function prevSlide() {
    if (isTransitioning) return;
    
    currentIndex--;
    updateCarousel();
    
    // Check if we need to loop after transition completes
    // When we reach the cloned last slide, seamlessly jump to real last slide
    if (currentIndex === 0) {
      handleLoopTransition('backward');
    }
  }
  
  // Function to start auto-play
  function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }
  
  // Function to stop auto-play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }
  
  // Navigate backward (left button - slide to left)
  navLeft.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTransitioning) return;
    
    stopAutoPlay(); // Pause auto-play on manual navigation
    prevSlide(); // Move backward (slide to left)
    
    // Resume auto-play after a delay to allow transition to start
    setTimeout(function() {
      startAutoPlay();
    }, 100);
  });
  
  // Navigate forward (right button - slide to right)
  navRight.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTransitioning) return;
    
    stopAutoPlay(); // Pause auto-play on manual navigation
    nextSlide(); // Move forward (slide to right)
    
    // Resume auto-play after a delay to allow transition to start
    setTimeout(function() {
      startAutoPlay();
    }, 100);
  });
  
  // Ensure buttons are clickable and visible
  navLeft.style.pointerEvents = 'auto';
  navRight.style.pointerEvents = 'auto';
  navLeft.style.zIndex = '10';
  navRight.style.zIndex = '10';
  
  // Pause auto-play on hover
  eventCarousel.addEventListener('mouseenter', stopAutoPlay);
  eventCarousel.addEventListener('mouseleave', startAutoPlay);
  
  // Handle window resize to recalculate position
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      updateCarousel(true);
    }, 250);
  });
  
  // Initialize carousel at the first real slide
  updateCarousel(true);
  
  // Verify buttons are clickable
  navLeft.setAttribute('type', 'button');
  navRight.setAttribute('type', 'button');
  navLeft.setAttribute('aria-label', 'Previous slide');
  navRight.setAttribute('aria-label', 'Next slide');
  
  // Start auto-play
  startAutoPlay();
});