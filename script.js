const loader = document.querySelector('.loader');
const cursor = document.querySelector('.cursor');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backTop = document.querySelector('.back-top');
const typingText = document.querySelector('#typingText');
const words = ['Java Developer', 'Python Enthusiast', 'Web Developer'];



// this is demo 
window.addEventListener('load', () => {
  loader.classList.add('hide');
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = words[wordIndex];
  typingText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
  } else if (deleting && charIndex > 0) {
    charIndex -= 1;
  } else {
    deleting = !deleting;
    if (!deleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const delay = deleting ? 46 : charIndex === current.length ? 1200 : 84;
  setTimeout(typeLoop, delay);
}

typeLoop();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = 'true';
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    const duration = 900;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      entry.target.textContent = Math.round(target * progress).toString().padStart(2, '0');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}, { threshold: 0.8 });

document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll('.skill-card').forEach((card) => {
  card.style.setProperty('--value', card.dataset.skill);
});

document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((0.5 - y / rect.height)) * 10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.addEventListener('mousemove', (event) => {
  if (!cursor) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;

  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;
  document.querySelectorAll('.parallax-card').forEach((item) => {
    item.style.transform = `rotateX(${-y / 5}deg) rotateY(${x / 5}deg)`;
  });
});

document.querySelectorAll('a, button, input, textarea').forEach((element) => {
  element.addEventListener('mouseenter', () => cursor?.style.setProperty('width', '34px'));
  element.addEventListener('mouseenter', () => cursor?.style.setProperty('height', '34px'));
  element.addEventListener('mouseleave', () => cursor?.style.setProperty('width', '18px'));
  element.addEventListener('mouseleave', () => cursor?.style.setProperty('height', '18px'));
});

window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 600);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const invalid = fields.find((field) => !field.checkValidity());

  fields.forEach((field) => {
    field.toggleAttribute('aria-invalid', !field.checkValidity());
  });

  if (invalid) {
    invalid.focus();
    formStatus.textContent = 'Please complete the highlighted field.';
    return;
  }

  form.reset();
  formStatus.textContent = 'Message ready. Thank you for reaching out.';
});

const canvas = document.querySelector('#particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function makeParticles() {
  const count = Math.min(80, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2 + 0.6,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.5 + 0.18
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 225, 212, ${particle.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  makeParticles();
});

resizeCanvas();
makeParticles();
drawParticles();
