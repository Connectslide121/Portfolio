// Tab functionality
var tablinks = document.querySelectorAll(".tab-links");
var tabcontents = document.querySelectorAll(".tab-contents");

function opentab(tabname) {
  console.log("Function called");
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

// Side menu
var sidemenu = document.querySelector("#sidemenu");

function openmenu() {
  console.log("Opening menu");
  console.log("Current right value:", sidemenu.style.right);
  sidemenu.style.right = "0";
}

function closemenu() {
  console.log("Closing menu");
  sidemenu.style.right = "-200px";
}

gsap.registerPlugin(ScrollTrigger, EasePack, ScrollToPlugin);

// Home scroll animation
const rings = document.querySelectorAll(".segment");
const homeScrollSection = document.querySelector("#home");
const textRight = document.querySelector(".text-right");
const textLeft = document.querySelector(".text-left");

var ringScale = 10;
var homeTextMove = 1500;

if (window.innerWidth < 1300) {
  ringScale = 8;
  homeTextMove = 1000;
}

if (window.innerWidth < 768) {
  ringScale = 3.5;
  homeTextMove = 600;
}

gsap.to(textRight, {
  x: homeTextMove,
  ease: "elastic.inOut",
  scrollTrigger: {
    trigger: homeScrollSection,
    start: "top top",
    scrub: 1
  }
});

gsap.to(textLeft, {
  x: -homeTextMove,
  ease: "elastic.inOut",
  scrollTrigger: {
    trigger: homeScrollSection,
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

rings.forEach((ring) => {
  gsap.to(ring, {
    scale: ringScale,
    ease: "back.inOut",
    scrollTrigger: {
      trigger: homeScrollSection,
      start: "top top",
      end: "bottom top",
      scrub: 0.6
    }
  });
});

// About me scroll animation
const aboutLeft = document.querySelector(".about-col-1");
const aboutRight = document.querySelector(".about-col-2");
const aboutTrigger = document.querySelector("#about");

if (window.innerWidth > 1300) {
  gsap.to(aboutLeft, {
    scale: 1.5,
    y: 0,
    ease: "power4.out",
    scrollTrigger: {
      trigger: aboutTrigger,
      start: "top center",
      end: "top top-=300",
      scrub: 1
    }
  });

  gsap.to(aboutLeft, {
    scale: 1,
    x: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: aboutTrigger,
      start: "top top-=200",
      scrub: 0.5
    }
  });

  gsap.to(aboutRight, {
    x: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: aboutTrigger,
      start: "top top",
      scrub: 0.5,
      pin: true
    }
  });
}

if (window.innerWidth <= 1300) {
  gsap.to(aboutLeft, {
    scale: 1,
    ease: "power4.out",
    scrollTrigger: {
      trigger: aboutTrigger,
      start: "top center+=200",
      end: "top top-=300",
      scrub: 0.1
    }
  });
}

// Services scroll animation

const service1 = document.querySelector(".service1");
const service2 = document.querySelector(".service2");
const service3 = document.querySelector(".service3");
const servicesTrigger = document.querySelector("#services");

if (window.innerWidth > 1300) {
  gsap.to(service1, {
    y: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top top-=600",
      end: "bottom bottom+=200",
      scrub: 0.5
    }
  });

  gsap.to(service2, {
    y: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top top-=700",
      end: "bottom bottom+=100",
      scrub: 0.5
    }
  });

  gsap.to(service3, {
    y: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top top-=800",
      end: "bottom bottom",
      scrub: 0.5
    }
  });
}

if (window.innerWidth <= 1300) {
  gsap.to(service1, {
    x: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top center+=400",
      end: "bottom bottom+=800",
      scrub: 0.3
    }
  });

  gsap.to(service2, {
    x: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top center",
      end: "bottom bottom+=400",
      scrub: 0.3
    }
  });

  gsap.to(service3, {
    x: 0,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: servicesTrigger,
      start: "top center-=400",
      end: "bottom bottom",
      scrub: 0.3
    }
  });
}

// My projects filter selector

const displayFrame = document.querySelector(".work-displayed");
const filterItems = document.querySelectorAll(".filter");
const projectList = document.querySelector("#work-list");
const projects = document.querySelectorAll(".work");

document.addEventListener("DOMContentLoaded", function () {
  filterItems.forEach(function (filterItem) {
    filterItem.addEventListener("click", function () {
      filterItems.forEach(function (item) {
        item.classList.remove("active-filter");
      });

      filterItem.classList.add("active-filter");

      var filterValue = filterItem.classList[1];

      projects.forEach(function (project) {
        var hasFilter = project.classList.contains(filterValue);

        project.style.display = hasFilter ? "block" : "none";
        projectList.classList = "work-list";
        displayFrame.innerHTML = "";
      });
    });
  });
});

// My projects display selector

Array.from(projects).forEach((project) => {
  project.addEventListener("click", displayProject);
});

function displayProject(event) {
  projects.forEach((project) => {
    project.classList.remove("active-work");
  });

  const workToDisplay = event.target.closest(".work");
  workToDisplay.classList.add("active-work");

  displayFrame.innerHTML = workToDisplay.innerHTML;
  projectList.classList = "work-scroller";
}

// Nav Links fix
const aboutNavLink = document.querySelector(".aboutNavLink");
const servicesNavLink = document.querySelector(".servicesNavLink");
const contactNavLinks = document.querySelectorAll(".contactNavLink");
const myWorkNavLink = document.querySelector(".myWorkNavLink");
const sections = document.querySelectorAll(
  "#home, #about, #services, #my-work, #contact"
);

const scrollToAbout =
  sections[0].offsetHeight + sections[1].offsetHeight - window.innerHeight;

const scrollToServices =
  sections[0].offsetHeight +
  sections[1].offsetHeight +
  sections[2].offsetHeight -
  window.innerHeight;

const scrollToMyWork =
  sections[0].offsetHeight +
  sections[1].offsetHeight +
  sections[2].offsetHeight;

const scrollToContact =
  sections[0].offsetHeight +
  sections[1].offsetHeight +
  sections[2].offsetHeight +
  sections[3].offsetHeight;

aboutNavLink.addEventListener("mousedown", (e) => {
  e.preventDefault();

  gsap.to(window, {
    scrollTo: {
      y: scrollToAbout,
      ease: "none"
    }
  });
});

servicesNavLink.addEventListener("mousedown", (e) => {
  e.preventDefault();

  gsap.to(window, {
    scrollTo: {
      y: scrollToServices,
      ease: "none"
    }
  });
});

Array.from(contactNavLinks).forEach((element) => {
  element.addEventListener("mousedown", (e) => {
    e.preventDefault();

    gsap.to(window, {
      scrollTo: {
        y: scrollToContact,
        ease: "none"
      }
    });
  });
});

myWorkNavLink.addEventListener("mousedown", (e) => {
  e.preventDefault();

  gsap.to(window, {
    scrollTo: {
      y: scrollToMyWork,
      ease: "none"
    }
  });
});

function setActiveNavLink(sectionId) {
  document.querySelectorAll(".navbar-link").forEach((link) => {
    link.classList.remove("active-navbar-link");
  });

  document
    .querySelector(`.${sectionId}NavLink`)
    .classList.add("active-navbar-link");
}

// Function to check which section is in the viewport
function getActiveSection() {
  const scrollPosition = window.scrollY;

  if (scrollPosition < scrollToAbout - window.innerHeight / 3) {
    setActiveNavLink("home");
  } else if (scrollPosition < scrollToServices - window.innerHeight / 3) {
    setActiveNavLink("about");
  } else if (scrollPosition < scrollToMyWork - window.innerHeight / 3) {
    setActiveNavLink("services");
  } else if (scrollPosition < scrollToContact - window.innerHeight / 3) {
    setActiveNavLink("myWork");
  } else {
    setActiveNavLink("contact");
  }
}

// Floating circles
var numberOfCircles = 12;

if (window.innerWidth < 768) {
  numberOfCircles = 8;
}

var collisionRadius = 75;

if (window.innerWidth < 768) {
  collisionRadius = 40;
}

const circles = [];
const cursorRadius = 25; // Adjust this value for the effective radius of the cursor

function getRandomPosition() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  return { x, y };
}

function createCircle() {
  const circle = document.createElement("div");
  circle.className = "floating-circle";
  document.querySelector("#circle-container").appendChild(circle);

  const { x, y } = getRandomPosition();
  circle.style.transform = `translate(${x}px, ${y}px)`;

  const vx = Math.random() * 10;
  const vy = Math.random() * 10;

  circles.push({
    element: circle,
    x,
    y,
    radius: collisionRadius,
    vx,
    vy
  });
}

function updateCircles(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  circles.forEach((circle, index) => {
    circle.x += circle.vx;
    circle.y += circle.vy;

    if (
      circle.x - circle.radius < 0 ||
      circle.x + circle.radius > window.innerWidth
    ) {
      circle.vx *= -1;
    }

    if (
      circle.y - circle.radius < 0 ||
      circle.y + circle.radius > window.innerHeight
    ) {
      circle.vy *= -1;
    }

    const distanceToCursor = Math.sqrt(
      (circle.x - mouseX) ** 2 + (circle.y - mouseY) ** 2
    );
    if (distanceToCursor < circle.radius + cursorRadius) {
      // Bounce off the cursor
      const angle = Math.atan2(circle.y - mouseY, circle.x - mouseX);
      circle.vx = Math.cos(angle) * 3; // Adjust the speed as needed
      circle.vy = Math.sin(angle) * 3; // Adjust the speed as needed
    }

    for (let i = 0; i < circles.length; i++) {
      if (i !== index && checkCollision(circle, circles[i])) {
        handleCollision(circle, circles[i]);
      }
    }

    circle.element.style.transform = `translate(${circle.x}px, ${circle.y}px)`;
  });
}

function checkCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

function handleCollision(circle1, circle2) {
  const tempVx = circle1.vx;
  const tempVy = circle1.vy;
  circle1.vx = circle2.vx;
  circle1.vy = circle2.vy;
  circle2.vx = tempVx;
  circle2.vy = tempVy;
}

for (let i = 0; i < numberOfCircles; i++) {
  createCircle();
}

setInterval(() => {
  requestAnimationFrame(() => updateCircles({ clientX: 0, clientY: 0 }));
}, 1000 / 60);

document.addEventListener("DOMContentLoaded", getActiveSection);
document.addEventListener("mousemove", updateCircles);
window.addEventListener("scroll", getActiveSection);
