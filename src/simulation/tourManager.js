import * as THREE from 'three';

/**
 * Guided Camera Tour Manager
 * Animates a 30-40 second cinematic drone flight visiting the 7 key stages of HelioAqua.
 */
export class TourManager {
  constructor(sceneManager, uiElements) {
    this.sm = sceneManager;
    this.ui = uiElements;

    this.currentStep = 0;
    this.isActive = false;
    this.timer = null;

    this.steps = [
      {
        badge: "Étape 1/7",
        title: "☀️ 1. Le Soleil de Tunisie",
        body: "La Tunisie bénéficie de plus de 3 000 heures d'ensoleillement par an. HelioAqua transforme cette ressource gratuite et inépuisable en moteur de prospérité agricole.",
        camPos: new THREE.Vector3(0, 52, 38),
        camTarget: new THREE.Vector3(0, 0, 0),
        duration: 5.0
      },
      {
        badge: "Étape 2/7",
        title: "⚡ 2. Les Panneaux Photovoltaïques",
        body: "Nos rangées de panneaux captent directement les photons du soleil. Des impulsions d'énergie propre circulent instantanément vers le système de pompage.",
        camPos: new THREE.Vector3(-25, 20, 10),
        camTarget: new THREE.Vector3(-25, 1, -4),
        duration: 5.0
      },
      {
        badge: "Étape 3/7",
        title: "⚙️ 3. La Station de Pompage Intelligente",
        body: "L'onduleur solaire alimente la pompe sans aucune goutte de carburant. Finies les fumées toxiques et les pannes coûteuses de générateurs diesel !",
        camPos: new THREE.Vector3(-11, 14, 11),
        camTarget: new THREE.Vector3(-11, 1.5, -2),
        duration: 5.0
      },
      {
        badge: "Étape 4/7",
        title: "💧 4. Le Réservoir & La Nappe Phréatique",
        body: "L'eau puisée dans la nappe est stockée en hauteur dans un réservoir tampon pour garantir une pression constante même lors des passages nuageux.",
        camPos: new THREE.Vector3(-6, 16, 8),
        camTarget: new THREE.Vector3(-7, 2.5, -4),
        duration: 5.0
      },
      {
        badge: "Étape 5/7",
        title: "🌿 5. L'Irrigation Goutte-à-Goutte",
        body: "Le réseau de tuyaux distribue l'eau avec une précision millimétrique aux racines des cultures. Zéro gaspillage par évaporation, jusqu'à 50% d'eau économisée !",
        camPos: new THREE.Vector3(8, 12, 10),
        camTarget: new THREE.Vector3(12, 0.5, 0),
        duration: 5.0
      },
      {
        badge: "Étape 6/7",
        title: "🍅 6. Des Récoltes Florissantes & Fellah Serein",
        body: "Des plants vigoureux et des rendements accrus : l'agriculteur élimine 60% de ses charges d'exploitation et sécurise l'avenir de sa famille.",
        camPos: new THREE.Vector3(16, 15, 22),
        camTarget: new THREE.Vector3(8, 1, 6),
        duration: 5.0
      },
      {
        badge: "Étape 7/7",
        title: "📊 7. Rentabilité & Modèle Économique",
        body: "Avec une marge de 8 400 DT par installation, le point mort est atteint dès 8 ventes. En An 1, 10 installations dégagent 22 740 DT de résultat net pour un retour sur capital de 38% !",
        camPos: new THREE.Vector3(0, 48, 36),
        camTarget: new THREE.Vector3(0, 0, 0),
        duration: 6.0
      }
    ];

    this.bindEvents();
  }

  bindEvents() {
    this.ui.btnStartTour.addEventListener('click', () => this.start());
    this.ui.btnTourClose.addEventListener('click', () => this.stop());
    this.ui.btnTourNext.addEventListener('click', () => this.next());
    this.ui.btnTourPrev.addEventListener('click', () => this.prev());
  }

  start() {
    this.isActive = true;
    this.currentStep = 0;
    this.ui.tourModal.style.display = 'block';
    this.showStep(0);
  }

  stop() {
    this.isActive = false;
    if (this.timer) clearTimeout(this.timer);
    this.ui.tourModal.style.display = 'none';
    this.sm.resetCamera();
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.stop();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  showStep(idx) {
    this.currentStep = idx;
    const step = this.steps[idx];

    this.ui.tourStepBadge.textContent = step.badge;
    this.ui.tourTitle.textContent = step.title;
    this.ui.tourBody.textContent = step.body;

    // Smooth drone flight to waypoint
    this.sm.animateCameraTo(step.camPos, step.camTarget, 1.4);

    // Auto advance
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.isActive) {
        if (this.currentStep < this.steps.length - 1) {
          this.showStep(this.currentStep + 1);
        } else {
          this.stop();
        }
      }
    }, step.duration * 1000);
  }
}
