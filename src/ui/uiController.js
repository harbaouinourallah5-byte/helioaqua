import { calculateFinancials } from '../simulation/businessModel.js';

/**
 * UIController
 * Handles all DOM elements, user input events, metrics updates, and dock transitions.
 */
export class UIController {
  constructor(appState, chartRenderer) {
    this.state = appState;
    this.chart = chartRenderer;

    // Cache elements
    this.el = {
      // Top bar
      btnToggleLabels: document.getElementById('btnToggleLabels'),
      btnResetCamera: document.getElementById('btnResetCamera'),
      btnStartTour: document.getElementById('btnStartTour'),
      topBadgeMode: document.getElementById('topBadgeMode'),

      // Left panel
      modeSwitch: document.getElementById('modeSwitch'),
      modeCard: document.getElementById('modeCard'),
      modeTitleText: document.getElementById('modeTitleText'),
      modeDescText: document.getElementById('modeDescText'),
      sliderTime: document.getElementById('sliderTime'),
      valTime: document.getElementById('valTime'),
      sliderSun: document.getElementById('sliderSun'),
      valSun: document.getElementById('valSun'),
      sliderInstalls: document.getElementById('sliderInstalls'),
      valInstalls: document.getElementById('valInstalls'),

      // Right panel
      labelEnergy: document.getElementById('labelEnergy'),
      subEnergy: document.getElementById('subEnergy'),
      valMetricPower: document.getElementById('valMetricPower'),
      valMetricWater: document.getElementById('valMetricWater'),
      valMetricSaved: document.getElementById('valMetricSaved'),
      valMetricCrop: document.getElementById('valMetricCrop'),
      valMetricCost: document.getElementById('valMetricCost'),
      subCost: document.getElementById('subCost'),
      metricCardCost: document.getElementById('metricCardCost'),

      // Bottom dock
      panelBottom: document.getElementById('panelBottom'),
      bottomHeader: document.getElementById('bottomHeader'),
      btnToggleDock: document.getElementById('btnToggleDock'),
      pillProfit: document.getElementById('pillProfit'),
      beStatusText: document.getElementById('beStatusText'),
      beProgressFill: document.getElementById('beProgressFill'),
      kpiCA: document.getElementById('kpiCA'),
      kpiCosts: document.getElementById('kpiCosts'),
      kpiResult: document.getElementById('kpiResult'),
      kpiMargin: document.getElementById('kpiMargin'),
      kpiResultBox: document.getElementById('kpiResultBox'),

      // Tour modal
      tourModal: document.getElementById('tourModal'),
      tourStepBadge: document.getElementById('tourStepBadge'),
      tourTitle: document.getElementById('tourTitle'),
      tourBody: document.getElementById('tourBody'),
      btnTourClose: document.getElementById('btnTourClose'),
      btnTourNext: document.getElementById('btnTourNext'),
      btnTourPrev: document.getElementById('btnTourPrev'),

      // Hotspots container
      hotspotsContainer: document.getElementById('hotspotsContainer') || document.getElementById('hotspots-container')
    };

    this.bindEvents();
    this.updateEconomics();
  }

  bindEvents() {
    // Mode Switch (Solar vs Diesel)
    this.el.modeSwitch.addEventListener('change', (e) => {
      this.state.isDiesel = e.target.checked;
      this.updateModeUI();
    });

    // Time Slider
    this.el.sliderTime.addEventListener('input', (e) => {
      this.state.timeOfDay = parseFloat(e.target.value);
      const hours = Math.floor(this.state.timeOfDay);
      const minutes = Math.round((this.state.timeOfDay % 1) * 60);
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      let label = 'Matin';
      if (this.state.timeOfDay === 12) label = 'Plein midi';
      else if (this.state.timeOfDay > 12 && this.state.timeOfDay < 17) label = 'Après-midi';
      else if (this.state.timeOfDay >= 17) label = 'Crépuscule';
      this.el.valTime.textContent = `${hours}:${minStr} (${label})`;
    });

    // Sun Intensity Slider
    this.el.sliderSun.addEventListener('input', (e) => {
      this.state.sunIntensity = parseFloat(e.target.value) / 100;
      let desc = 'Plein soleil';
      if (this.state.sunIntensity < 0.4) desc = 'Nuageux';
      else if (this.state.sunIntensity < 0.8) desc = 'Modéré';
      this.el.valSun.textContent = `${Math.round(this.state.sunIntensity * 100)}% (${desc})`;
    });

    // Installations Sold Slider (expands 3D scene)
    this.el.sliderInstalls.addEventListener('input', (e) => {
      this.state.installationsCount = parseInt(e.target.value, 10);
      this.el.valInstalls.textContent = `${this.state.installationsCount} unité${this.state.installationsCount > 1 ? 's' : ''}`;
      this.updateEconomics();
    });

    // Labels Visibility Toggle
    this.el.btnToggleLabels.addEventListener('click', () => {
      this.state.showLabels = !this.state.showLabels;
      this.el.btnToggleLabels.classList.toggle('active', this.state.showLabels);
      this.el.hotspotsContainer.style.display = this.state.showLabels ? 'block' : 'none';
    });

    // Bottom dock collapse/expand
    this.el.bottomHeader.addEventListener('click', () => {
      this.el.panelBottom.classList.toggle('collapsed');
      const isCollapsed = this.el.panelBottom.classList.contains('collapsed');
      this.el.btnToggleDock.textContent = isCollapsed ? '▲' : '▼';
    });
  }

  updateModeUI() {
    if (this.state.isDiesel) {
      this.el.modeCard.classList.add('diesel-mode');
      this.el.modeTitleText.textContent = "⛽ Diesel (Moteur thermique)";
      this.el.modeTitleText.style.color = "#dc2626";
      this.el.modeDescText.textContent = "Carburant polluant et cher";
      this.el.topBadgeMode.textContent = "Mode Diesel";
      this.el.topBadgeMode.style.background = "#fee2e2";
      this.el.topBadgeMode.style.color = "#b91c1c";

      this.el.labelEnergy.textContent = "⛽ Puissance Moteur";
      this.el.subEnergy.textContent = "Consommation 1,8 L/h";
      this.el.metricCardCost.classList.add('alert');
      this.el.subCost.textContent = "Facture de gasoil en hausse !";
      this.el.subCost.style.color = "#ef4444";
    } else {
      this.el.modeCard.classList.remove('diesel-mode');
      this.el.modeTitleText.textContent = "☀️ Solaire (HelioAqua)";
      this.el.modeTitleText.style.color = "#10b981";
      this.el.modeDescText.textContent = "0 DT carburant • Zéro fumée";
      this.el.topBadgeMode.textContent = "Mode Solaire";
      this.el.topBadgeMode.style.background = "#dbeafe";
      this.el.topBadgeMode.style.color = "#1e40af";

      this.el.labelEnergy.textContent = "⚡ Puissance Solaire";
      this.el.subEnergy.textContent = "Production instantanée";
      this.el.metricCardCost.classList.remove('alert');
      this.el.valMetricCost.textContent = "0 DT";
      this.el.valMetricCost.style.color = "#10b981";
      this.el.subCost.textContent = "Énergie 100% Gratuite !";
      this.el.subCost.style.color = "#10b981";
    }
  }

  updateMetrics(effectiveSolarFactor, dt) {
    // 1. Power
    if (this.state.isDiesel) {
      this.el.valMetricPower.textContent = "1 800 W";
    } else {
      const p = Math.round(effectiveSolarFactor * 3200);
      this.el.valMetricPower.textContent = `${p.toLocaleString('fr-FR')} W`;
    }

    // 2. Water Flow (m³/h)
    let waterM3 = 0;
    if (this.state.isDiesel) waterM3 = 4.2;
    else waterM3 = (effectiveSolarFactor * 5.6);
    this.el.valMetricWater.textContent = `${waterM3.toFixed(1)} m³/h`;

    // 3. Water Saved
    this.el.valMetricSaved.textContent = this.state.isDiesel ? "−15 %" : "−48 %";

    // 4. Crop Growth & Health
    if (waterM3 > 1.0) {
      this.state.cropGrowth = Math.min(100, this.state.cropGrowth + dt * 0.35);
    } else {
      this.state.cropGrowth = Math.max(30, this.state.cropGrowth - dt * 0.15);
    }
    this.el.valMetricCrop.textContent = `${Math.round(this.state.cropGrowth)} %`;

    // 5. Fuel Cost accumulation
    if (this.state.isDiesel) {
      this.state.dieselCost += 0.22 * dt;
      this.el.valMetricCost.textContent = `${this.state.dieselCost.toFixed(2)} DT`;
      this.el.valMetricCost.style.color = "#ef4444";
    }
  }

  updateEconomics() {
    const fin = calculateFinancials(this.state.installationsCount);

    this.el.kpiCA.textContent = `${fin.revenue.toLocaleString('fr-FR')} DT`;
    this.el.kpiCosts.textContent = `${fin.totalCosts.toLocaleString('fr-FR')} DT`;

    if (fin.netResult >= 0) {
      this.el.kpiResult.textContent = `+${fin.netResult.toLocaleString('fr-FR')} DT`;
      this.el.kpiResult.style.color = "#047857";
      this.el.kpiResultBox.style.background = "#ecfdf5";
      this.el.kpiResultBox.style.borderColor = "#a7f3d0";
      this.el.kpiMargin.textContent = `~${fin.netMarginPercent.toFixed(1)}% marge`;

      this.el.pillProfit.className = "pill-profit";
      this.el.pillProfit.textContent = `Bénéficiaire : +${fin.netResult.toLocaleString('fr-FR')} DT`;
      this.el.beProgressFill.style.background = "linear-gradient(90deg, #10b981, #059669)";
      this.el.beStatusText.textContent = `Seuil de 8 atteint ! Projet rentable`;
      this.el.beStatusText.style.color = "#15803d";
    } else {
      this.el.kpiResult.textContent = `${fin.netResult.toLocaleString('fr-FR')} DT`;
      this.el.kpiResult.style.color = "#dc2626";
      this.el.kpiResultBox.style.background = "#fef2f2";
      this.el.kpiResultBox.style.borderColor = "#fecaca";
      this.el.kpiMargin.textContent = `Déficit d'exploitation`;

      this.el.pillProfit.className = "pill-profit loss";
      this.el.pillProfit.textContent = `Déficitaire : ${fin.netResult.toLocaleString('fr-FR')} DT`;
      this.el.beProgressFill.style.background = "linear-gradient(90deg, #f87171, #ef4444)";
      const rem = 8 - this.state.installationsCount;
      this.el.beStatusText.textContent = `Encore ${rem} vente${rem > 1 ? 's' : ''} pour atteindre le seuil`;
      this.el.beStatusText.style.color = "#b91c1c";
    }

    this.el.beProgressFill.style.width = `${fin.breakEvenProgress}%`;

    // Render interactive SVG chart
    this.chart.renderBreakEvenChart(this.state.installationsCount, fin.revenue, fin.totalCosts);
  }
}
