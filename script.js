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
