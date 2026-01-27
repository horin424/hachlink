

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

// Event Carousel Functionality with Swiper
document.addEventListener('DOMContentLoaded', function() {
  const eventSwiper = new Swiper('.event-carousel', {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });
});