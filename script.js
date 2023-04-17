'use strict';

///////////////////////////////////////
// DOM components
const header = document.querySelector(".header");

// modal window components
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const highlight = document.querySelectorAll(".highlight");
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// navbar components and coordinates
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;

// "learn more" components (smooth scroll)
const triggerBtn = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const section1Coords = section1.getBoundingClientRect();

// tabs operations components
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");

// section revealing components
const allSections = document.querySelectorAll(".section");

// lazy load images
const images = document.querySelectorAll("img[data-src]");

// slider components
const dotContainer = document.querySelector(".dots");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");


///////////////////////////////////////
// Modal window

/**
 * Opens modal window that allows user to create an account
 * @param {Event} e 
 */
const openModal = function (e) {
  e.preventDefault();
  
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  
  const highlightSpan = modal.querySelector(".highlight");
  highlightSpan.classList.remove("highlight");
  setTimeout(() => {highlightSpan.classList.add("highlight")}, 200)
};

/**
 * Closes modal window
 */
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal))
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////////////////////////
// Animating highlighted text when DOM loaded

highlight.forEach(element => element.classList.remove('highlight'));
document.addEventListener("DOMContentLoaded", function () {
  highlight.forEach(element => element.classList.add('highlight'));
})


///////////////////////////////////
// Creating cookie message
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML = 'We use cookies to improve our services. <button class="btn btn--close-cookie" style="margin: 10px 0px 10px 0px">Got it!</button>';
message.style.backgroundColor = "#37383d"
message.style.position = "fixed";
message.style.bottom = 0;
message.style.zIndex = 9999;
message.style.transition = "all 0.3s ease-in-out";
header.append(message);

// deleting cookie message on click
message.querySelector(".btn--close-cookie").addEventListener('click', () => {
  message.style.opacity = 0;
  setTimeout(() => message.remove(), 1000);
});


///////////////////////////////////
// Implementing smooth scroll on trigger button 

triggerBtn.addEventListener('click', function() {
  window.scrollTo({
    top: section1Coords.top + window.pageXOffset,
    left: section1Coords.left + window.pageYOffset,
    behavior: 'smooth'
  })
})


///////////////////////////////////
// Page navigation implementation (with smooth scroll)

document.querySelector(".nav__links").addEventListener("click", e => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})


///////////////////////////////////
// Implementing tabbed component 

tabsContainer.addEventListener("click", e => {
  const clicked = e.target.closest(".operations__tab");
  
  // return if nothing is selected
  if (!clicked) return;

  // deactivating all buttons and containers
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  tabsContent.forEach(c => {
    c.style.opacity = 0;
    setTimeout(function() {
      c.classList.remove("operations__content--active");
    }, 200)
  });

  // activating clicked elements
  clicked.classList.add("operations__tab--active");
  setTimeout(function() {
    const element = document.querySelector(`.operations__content--${clicked.dataset.tab}`);
    element.classList.add("operations__content--active");
    element.style.opacity = 1;
  }, 200)
})


///////////////////////////////////
// Menu animations
const handleHover = function (e, opacity) {
  if (!e.target.classList.contains("nav__link")) return;

  const target = e.target;
  const siblings = target.closest(".nav").querySelectorAll(".nav__link");
  const logo = target.closest(".nav").querySelector("img");

  siblings.forEach(el => {
    if (el !== target) el.style.opacity = opacity;
    logo.style.opacity = opacity;
  })
}

nav.addEventListener("mouseover", e => handleHover(e, 0.5));
nav.addEventListener("mouseout", e => handleHover(e, 1));
// another option to solve this
// nav.addEventListener("mouseover", handleHover.bind(0.5));
// nav.addEventListener("mouseout", handleHover.bind(0.5));


///////////////////////////////////
// Implementing sticky navigation
let firstRun = true; // prevent init run

/**
 * Makes navbar "sticky" if user scrolled to section 2
 * @param {threshold} entries 
 * @returns 
 */
const navSticky = function (entries) {
  const [entry] = entries;

  if (firstRun) {
    firstRun = false;
    return;
  }

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else {
    nav.style.opacity = 0;
    setTimeout(function() {
      nav.classList.remove("sticky");
      nav.style.opacity = 1;
    }, 100)
  }

}

const navObserverParam = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}

const headerObserver = new IntersectionObserver(navSticky, navObserverParam);

headerObserver.observe(header);


///////////////////////////////////
// Revealing sections (animation)

/**
 * Reveals section with smooth animation, when section is in view
 * @param {threshold} entries 
 * @param {IntersectionObserver} observer 
 * @returns 
 */
const revealSection = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

const sectionObserverParam = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(revealSection, sectionObserverParam);

allSections.forEach(section => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
})


///////////////////////////////////
// Implementing lazy load of images

/**
 * Lazy loads new images in the background, when images is in view
 * @param {threshold} entries 
 * @param {IntersectionObserver} observer 
 * @returns 
 */
const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  const target = entry.target;

  if (!entry.isIntersecting) return;

  target.src = target.dataset.src;

  target.addEventListener("load", function() {
    observer.unobserve(target);
    target.classList.remove("lazy-img");
  })
}

const imgObserverParam = {
  root: null,
  threshold: 0,
  rootMargin: "100px",
}

const imgObserver = new IntersectionObserver(lazyLoad, imgObserverParam);

images.forEach(img => imgObserver.observe(img))

///////////////////////////////////
// Implementing slider

let currentSlide = 0;
const maxSlides = slides.length;

/**
 * Creates slider dots
 */
const createDots = function() {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`)
  })
}

/**
 * Makes one of the dots active, based on slide
 * @param {Number} currSlide 
 */
const activateDot = function(currSlide) {
  document.querySelectorAll(".dots__dot")
  .forEach(dot => dot.classList.remove("dots__dot--active"))

  document.querySelector(`.dots__dot[data-slide="${currSlide}"]`).classList.add("dots__dot--active");
}

dotContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("dots__dot")) {
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})

/**
 * Scrolls to slide
 * @param {Number} currSlide 
 */
const goToSlide = function(currSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currSlide)}%)`;
  });
}

/**
 * Scrolls to next slide in slider
 */
const nextSlide = function() {
  if (currentSlide === maxSlides - 1)
    currentSlide = 0;
  else
    currentSlide++;

  goToSlide(currentSlide);
  activateDot(currentSlide);
}

/**
 * Scrolls to previous slide in slider
 */
const previousSlide = function() {
  if (currentSlide === 0)
    currentSlide = maxSlides - 1;
  else
    currentSlide--;

  goToSlide(currentSlide);
  activateDot(currentSlide);
}

/**
 * Initializes slider for work
 */
const initSlider = function() {
  goToSlide(0);
  createDots();
  activateDot(0);
}

initSlider();

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", previousSlide);
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") previousSlide();
  if (e.key === "ArrowRight") nextSlide();
})
