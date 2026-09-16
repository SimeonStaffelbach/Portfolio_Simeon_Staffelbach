const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.prepend(scrollProgress);

let progressFrame;
const updateScrollProgress = () => {
  if (motionReduced) return;
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
    progressFrame = null;
  });
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

if (!motionReduced && window.matchMedia('(pointer: fine)').matches) {
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    heroArt.addEventListener('pointermove', (event) => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty('--hero-x', `${x * 9}deg`);
      heroArt.style.setProperty('--hero-y', `${y * -9}deg`);
      heroArt.style.setProperty('--hero-z', `${Math.abs(x) * 10}px`);
    });
    heroArt.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--hero-x', '0deg');
      heroArt.style.setProperty('--hero-y', '0deg');
      heroArt.style.setProperty('--hero-z', '0px');
    });
  }

  document.querySelectorAll('.project-visual').forEach((visual) => {
    visual.addEventListener('pointermove', (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      visual.style.transform = `perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-8px)`;
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.transform = '';
    });
  });
}

const heroSection = document.querySelector('.hero');
if (!motionReduced && heroSection) {
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * 0.12, 90);
    heroSection.style.setProperty('--hero-scroll', `${offset}px`);
  }, { passive: true });
}

document.querySelectorAll('a[href]').forEach((link) => {
  const destination = link.getAttribute('href');
  if (!destination || destination.startsWith('#') || destination.startsWith('mailto:') || destination.startsWith('tel:') || link.target === '_blank') return;
  link.addEventListener('click', (event) => {
    if (motionReduced || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = destination; }, 350);
  });
});

document.querySelectorAll('.contact-footer span:last-child').forEach((backLink) => {
  backLink.style.cursor = 'pointer';
  backLink.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

const projectGrid = document.querySelector('.project-grid');
const projectTabs = document.querySelectorAll('.project-tab');

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const projects = [...projectGrid.children];
    const direction = tab.dataset.sort === 'oldest' ? 1 : -1;

    projects.sort((first, second) => direction * (Number(first.dataset.order) - Number(second.dataset.order)));
    projectGrid.classList.remove('is-sorting');
    projects.forEach((project) => projectGrid.appendChild(project));
    requestAnimationFrame(() => projectGrid.classList.add('is-sorting'));
    projectTabs.forEach((item) => {
      item.classList.toggle('is-active', item === tab);
      item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
    });
  });
});

const archiveGrid = document.querySelector('.photography-collage .collage-grid');
const archiveTabs = document.querySelectorAll('.archive-tab');
const archiveDates = {
  'DSC03695.JPG':'2026-07-13','DSC03718.JPG':'2026-07-13','DSC03721.JPG':'2026-07-13','DSC03722.JPG':'2026-07-13','DSC03734.JPG':'2026-07-13','DSC03738.JPG':'2026-07-13','DSC03740.JPG':'2026-07-13','DSC03747.JPG':'2026-07-13','DSC03765.JPG':'2026-07-13','DSC03772.JPG':'2026-07-13','DSC03783.JPG':'2026-07-13',
  'DSC04779.JPG':'2026-09-04','DSC04786.JPG':'2026-09-04','DSC04787.JPG':'2026-09-04','DSC04796.JPG':'2026-09-04','DSC04802.JPG':'2026-09-04','DSC04819.JPG':'2026-09-04','DSC05130.JPG':'2026-09-04',
  'P1010003.jpg':'2026-05-06','P1010005.jpg':'2026-05-06','P1010008.jpg':'2026-05-10','P1010018.jpg':'2026-05-06','P1010022.jpg':'2026-04-18','P1010022_2.jpg':'2026-05-06','P1010026.jpg':'2026-05-06','P1010029_2.jpg':'2026-05-06','P1010031.jpg':'2026-05-06','P1010034.jpg':'2026-05-10','P1010041.jpg':'2026-04-18','P1010042.jpg':'2026-05-06','P1010048_2.jpg':'2026-05-10','P1010050.jpg':'2026-04-18','P1010051.jpg':'2026-04-18','P1010052.jpg':'2026-04-18','P1010053_2.jpg':'2026-05-10','P1010054.jpg':'2026-04-18','P1010056.jpg':'2026-04-18','P1010073.jpg':'2026-05-06','P1010075.jpg':'2026-05-06','P1010079.jpg':'2026-05-06','P1010097-2.jpg':'2026-05-17','P1010110-2.jpg':'2026-05-17','P1010113.jpg':'2026-05-17','P1010127.jpg':'2026-04-18','P1010138.jpg':'2026-05-10','P1010146.jpg':'2026-04-18','P1010147.jpg':'2026-04-18','P1010158.jpg':'2026-05-17'
};

if (archiveGrid && archiveTabs.length) {
  const archiveItems = [...archiveGrid.children];
  archiveItems.forEach((item) => {
    const fileName = item.querySelector('img').src.split('/').pop();
    item.dataset.captured = archiveDates[fileName] || '';
  });
  archiveTabs.forEach((tab) => tab.addEventListener('click', () => {
    const mode = tab.dataset.archiveSort;
    const items = [...archiveGrid.children];
    if (mode === 'mix') {
      for (let index = items.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
      }
    } else {
      const direction = mode === 'oldest' ? 1 : -1;
      items.sort((first, second) => direction * (Date.parse(first.dataset.captured) - Date.parse(second.dataset.captured)));
    }
    archiveGrid.classList.remove('is-sorting');
    items.forEach((item) => archiveGrid.appendChild(item));
    requestAnimationFrame(() => archiveGrid.classList.add('is-sorting'));
    archiveTabs.forEach((item) => {
      item.classList.toggle('is-active', item === tab);
      item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
    });
  }));
}

const methodVisual = document.querySelector('.method-visual');
if (methodVisual && window.matchMedia('(pointer: fine)').matches) {
  methodVisual.addEventListener('pointermove', (event) => {
    const bounds = methodVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    methodVisual.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
  });
  methodVisual.addEventListener('pointerleave', () => {
    methodVisual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

document.querySelectorAll('.gallery-photo img').forEach((image) => {
  image.addEventListener('error', () => {
    image.classList.add('is-missing');
    image.alt = 'Bild noch nicht eingefügt';
  });
});

const lightStage = document.querySelector('.light-stage');
const lightModes = document.querySelectorAll('.light-mode');
const lightAngle = document.querySelector('#light-angle');
const angleValue = document.querySelector('#angle-value');
const modeDescription = document.querySelector('.mode-description');
const modeCopy = {
  butterfly: ['butterfly lighting', 'Das Licht kommt frontal von oben. Unter der Nase entsteht ein kleiner Schmetterlingsschatten: weich, sauber und professionell.', 'Softbox frontal und leicht über Augenhöhe', 'weisser Reflektor unter dem Gesicht'],
  rembrandt: ['rembrandt lighting', 'Das Licht steht schräg von oben. Auf der Schattenseite bleibt ein kleines Lichtdreieck: dramatisch und künstlerisch.', 'Softbox schräg seitlich und über Augenhöhe', 'schwarzer Reflektor oder negative fill für mehr Schatten'],
  loop: ['loop lighting', 'Das Licht kommt schräg von vorne. Der Nasenschatten fällt leicht zur Seite: natürlich und plastisch.', 'Softbox schräg frontal, ungefähr 30 bis 45 Grad', 'weisser Reflektor auf der Schattenseite'],
  split: ['split lighting', 'Das Licht kommt direkt von der Seite und teilt das Gesicht in hell und dunkel: stark und kontrastreich.', 'Softbox oder harte Lampe direkt seitlich', 'kein Reflektor für maximalen Kontrast'],
  rim: ['rim light', 'Das Licht kommt von hinten und zeichnet eine helle Kante. So hebt sich die Person klar vom Hintergrund ab.', 'Stripbox oder hartes Licht hinter dem Motiv', 'Softbox frontal als schwaches Fill-Light']
};

if (lightStage && lightAngle) {
  const updateLight = (mode, angle) => {
    const keyPositions = {
      butterfly: ['50%', '8%'],
      rembrandt: ['29%', '15%'],
      loop: ['34%', '29%'],
      split: ['9%', '43%'],
      rim: ['79%', '29%']
    };
    const keyLight = lightStage.querySelector('.key-light');
    lightStage.dataset.mode = mode;
    lightStage.querySelector('.stage-mode-label').textContent = modeCopy[mode][0].toUpperCase();
    modeDescription.innerHTML = `<strong>${modeCopy[mode][0]}</strong><span>${modeCopy[mode][1]}</span><div class="equipment"><b>setup</b><span>${modeCopy[mode][2]}</span><span>${modeCopy[mode][3]}</span></div>`;
    keyLight.style.left = keyPositions[mode][0];
    keyLight.style.top = keyPositions[mode][1];
    keyLight.style.transform = `rotate(${angle}deg)`;
    lightStage.querySelector('.subject-3d').style.transform = `translate(-50%,-50%) rotateY(${angle / 2 - 8}deg)`;
    angleValue.value = `${angle}°`;
  };
  lightModes.forEach((button) => button.addEventListener('click', () => {
    lightModes.forEach((item) => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-selected', item === button ? 'true' : 'false');
    });
    updateLight(button.dataset.mode, Number(lightAngle.value));
  }));
  lightAngle.addEventListener('input', () => updateLight(lightStage.dataset.mode, Number(lightAngle.value)));
}
