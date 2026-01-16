// Event Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const eventCarousel = document.querySelector('.event-carousel');
  const carouselWrapper = document.querySelector('.event-carousel-wrapper');
  const carouselImages = document.querySelectorAll('.carousel-event-image');
  const navLeft = document.querySelector('.event-section .nav-left');
  const navRight = document.querySelector('.event-section .nav-right');
  
  if (!carouselWrapper || !carouselImages.length || !navLeft || !navRight || !eventCarousel) {
    return;
  }
  
  let currentIndex = 1; // Start with second image
  const totalSlides = carouselImages.length;
  let isAnimating = false;
  const TRANSITION_LOCK_MS = 1050; // keep close to CSS transition (currently 1s)
  
  // Update carousel position by sliding to the actual slide's offset
  function updateCarousel() {
    const target = carouselImages[currentIndex];
    if (!target) return;
    
    // Get the carousel container width (accounting for padding)
    const carouselWidth = eventCarousel.offsetWidth;
    const slideWidth = target.offsetWidth || target.getBoundingClientRect().width;
    
    // Calculate the offset of the target slide relative to the wrapper
    // Since slides are in a flex container, we can use offsetLeft
    const wrapperRect = carouselWrapper.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetOffset = targetRect.left - wrapperRect.left;
    
    // Center the slide in the carousel viewport
    const carouselPadding = 10; // padding from CSS
    const visibleWidth = carouselWidth - (carouselPadding * 2);
    const translateX = -(targetOffset - (visibleWidth / 2) + (slideWidth / 2));
    
    carouselWrapper.style.transform = `translateX(${translateX}px)`;
  }

  function lockDuringTransition() {
    isAnimating = true;
    window.setTimeout(() => {
      isAnimating = false;
    }, TRANSITION_LOCK_MS);
  }
  
  // Navigate to next slide (right)
  function slideRight() {
    if (isAnimating) return;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
    lockDuringTransition();
  }
  
  // Navigate to previous slide (left)
  function slideLeft() {
    if (isAnimating) return;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
    lockDuringTransition();
  }
  
  // Event listeners for navigation buttons
  navRight.addEventListener('click', (e) => {
    e.preventDefault();
    slideRight();
  });
  navLeft.addEventListener('click', (e) => {
    e.preventDefault();
    slideLeft();
  });
  
  // Initialize carousel position
  const initCarousel = () => {
    // Start with second slide (index 1)
    currentIndex = 1;
    carouselWrapper.style.transform = 'translateX(0px)';
    setTimeout(() => {
      updateCarousel();
    }, 50);
  };
  
  // Initialize after a short delay to ensure layout is ready
  setTimeout(initCarousel, 100);
  
  // Recalculate positions when layout changes
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 250);
  });

  // Ensure correct offsets after images/fonts finish loading
  window.addEventListener('load', () => {
    setTimeout(() => {
      updateCarousel();
    }, 100);
  });
  
  // Handle image load events to recalculate positions
  carouselImages.forEach((slide) => {
    const img = slide.querySelector('img');
    if (img) {
      img.addEventListener('load', () => {
        if (!isAnimating) {
          updateCarousel();
        }
      });
    }
  });
});

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

// Book Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const bookCarousel = document.querySelector('.book-carousel-');
  const bookCards = document.querySelectorAll('.book-card');
  const prevBtn = document.querySelector('.curr-controls .prev');
  const nextBtn = document.querySelector('.curr-controls .next');
  const dots = document.querySelectorAll('.curr-controls .dot');
  
  if (!bookCarousel || !bookCards.length || !prevBtn || !nextBtn || !dots.length) {
    return;
  }
  
  let currentIndex = 0;
  const totalCards = bookCards.length;
  let isScrolling = false;
  let userScrolling = false;
  
  // Update active dot
  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Scroll to specific card
  function scrollToCard(index, smooth = true) {
    // Ensure index is within bounds
    if (index < 0) index = 0;
    if (index >= totalCards) index = totalCards - 1;
    
    currentIndex = index;
    const targetCard = bookCards[currentIndex];
    
    if (targetCard) {
      isScrolling = true;
      userScrolling = false;
      
      // Calculate scroll position
      const cardOffsetLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      const carouselWidth = bookCarousel.offsetWidth;
      
      // Center the card in the carousel viewport
      const targetScroll = cardOffsetLeft - (carouselWidth / 2) + (cardWidth / 2);
      
      bookCarousel.scrollTo({
        left: targetScroll,
        behavior: smooth ? 'smooth' : 'auto'
      });
      
      updateDots();
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrolling = false;
      }, smooth ? 600 : 100);
    }
  }
  
  // Navigate to next card
  function nextCard() {
    if (isScrolling) return;
    const nextIndex = (currentIndex + 1) % totalCards;
    scrollToCard(nextIndex);
  }
  
  // Navigate to previous card
  function prevCard() {
    if (isScrolling) return;
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    scrollToCard(prevIndex);
  }
  
  // Event listeners for navigation buttons
  nextBtn.addEventListener('click', nextCard);
  prevBtn.addEventListener('click', prevCard);
  
  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!isScrolling) {
        scrollToCard(index);
      }
    });
  });
  
  // Update dots when user manually scrolls
  let scrollTimeout;
  bookCarousel.addEventListener('scroll', () => {
    if (isScrolling) return; // Ignore programmatic scrolling
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Find the card closest to the center
      const carouselRect = bookCarousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      bookCards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - carouselCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      if (currentIndex !== closestIndex) {
        currentIndex = closestIndex;
        updateDots();
      }
    }, 150);
  });
  
  // Initialize
  updateDots();
  // Scroll to first card without animation on load
  setTimeout(() => {
    scrollToCard(0, false);
  }, 100);
  
  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      scrollToCard(currentIndex, false);
    }, 250);
  });
});

