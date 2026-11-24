/**
 * VISHAL M — PORTFOLIO INTERACTIVITY SCRIPT
 * Minimalist Monochrome Theme
 * Handles project filtering, modal deep dives,
 * dynamic role typing, and interactive telemetry simulations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Clear any legacy dark-mode localStorage
  try {
    localStorage.removeItem('vm-portfolio-theme');
    document.documentElement.removeAttribute('data-theme');
  } catch (e) {}

  initDynamicTyping();
  initMobileMenu();
  initProjectsFilterAndSearch();
  initProjectModals();
  initSensorDemo();
  initBIDemo();
  initContactActions();
});

/* --------------------------------------------------------------------------
   2. Dynamic Typing Effect for Hero Roles
   -------------------------------------------------------------------------- */
function initDynamicTyping() {
  const roleEl = document.getElementById('dynamicRole');
  if (!roleEl) return;

  const roles = [
    'M.Sc. Data Science Candidate',
    'Machine Learning Practitioner',
    'B.Sc. CS & Statistics',
    'Power BI & Analytics Specialist',
    'AI Systems & Deep Learning',
    'Aspiring Data Scientist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      roleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileDrawer) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    mobileDrawer.setAttribute('aria-hidden', !isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --------------------------------------------------------------------------
   4. Projects Filter & Search System
   -------------------------------------------------------------------------- */
function initProjectsFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('projectSearch');
  const clearBtn = document.getElementById('clearSearch');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.getElementById('noResultsMessage');
  const resetBtn = document.getElementById('resetFiltersBtn');

  let activeFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = card.getAttribute('data-tags') || '';
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const summary = card.querySelector('.project-summary')?.textContent.toLowerCase() || '';

      const matchesFilter = (activeFilter === 'all') || (category === activeFilter);
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        summary.includes(searchQuery) || 
        tags.toLowerCase().includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      applyFilters();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Project Deep Dive Modal System
   -------------------------------------------------------------------------- */
const PROJECT_DETAILS = {
  cropnow: {
    title: 'CropNow — IoT Agricultural Intelligence System',
    category: 'Machine Learning & IoT Architecture',
    github: 'https://github.com/vishalm111/CropNow',
    summary: 'A complete end-to-end telemetry conditioning and agricultural ML prediction platform pairing a Python FastAPI backend with an interactive React 19 dashboard.',
    sections: [
      {
        title: 'Core Problem Addressed',
        content: 'Agricultural IoT field sensors suffer from high transient noise, probe spikes, and relay chatter if fed directly into binary threshold irrigation logic. Furthermore, environmental risk horizons operate at mismatched cadences (24-hour hydrology, 7-day fungal incubation, 28-day insect reproduction).'
      },
      {
        title: 'Signal Stabilization & Telemetry Conditioning',
        content: 'Constructed the SoilMoistureStabilizer pipeline featuring a 5-point causal median filter, EWMA exponential smoothing (alpha = 0.3), and a step-change bypass (|delta| >= 3.0% switches to alpha_fast = 0.95) to preserve real wetting infiltration fronts while eliminating spurious jitter.'
      },
      {
        title: 'Multi-Horizon Machine Learning Models',
        content: '• 24-Hour Residual Soil Moisture: Predicts delta_y via XGBoost & PyTorch GRU, reconstructing absolute values across crop-specific PWP, MADP, FC, and SP thresholds.<br>• 7-Day Fungal Disease Risk: Aggregates 336 30-minute packets into 38 environmental features (Magnus-Tetens dew point depression, leaf wetness hours) via regularized XGBoost.<br>• 28-Day Pest Outbreak Risk: Evaluates 1,344 packets (26 weather features) using a regularized Logistic Regression classifier.'
      },
      {
        title: 'Tech Stack & Quality Assurance',
        content: 'Python 3.11, FastAPI, PyTorch (GRU), XGBoost, scikit-learn, React 19, Vite, Recharts, 112 pytest automated backend test cases.'
      }
    ]
  },
  crisis: {
    title: 'Crisis Command: Multi-Agent Emergency Response',
    category: 'Hackathon Project — Gateways 2026',
    github: 'https://github.com/vishalm111/Crisis_Command_Hackathon',
    summary: 'Built for Gateways 2026 Hackathon under Domain 4: Crisis Command by Team Neural Ninjas. An autonomous multi-agent decision support workflow for crisis management.',
    sections: [
      {
        title: 'Challenge Statement',
        content: 'During major natural or civil catastrophes, multiple high-severity incidents unfold concurrently while response resources (ambulances, firefighting units, search-and-rescue) are strictly finite. Control-room commanders require an immediate operational picture, dynamic priority reassessment, and transparent trade-off analyses.'
      },
      {
        title: 'Multi-Agent Collaborative Design',
        content: 'The workflow orchestrates specialized agents: Ingestion Agent (parses raw distress calls), Triage Agent (scores vulnerability, infrastructure risk, and casualty proximity), Allocation Agent (computes optimal dispatch routes given inventory constraints), and Operator Briefing Agent (generates clear audit trails and trade-off disclosures).'
      },
      {
        title: 'Impact & Results',
        content: 'Enabled command staff to test "what-if" resource reassignments in seconds, minimizing response latency and preventing secondary hazard escalations.'
      }
    ]
  },
  healthcare: {
    title: 'Healthcare Analytics Dashboard (Power BI)',
    category: 'Business Intelligence & Clinical Analytics',
    github: 'https://github.com/vishalm111/Healthcare-Analytics-Dashboard',
    summary: 'An interactive clinical telemetry dashboard built with Microsoft Power BI, utilizing bookmark-driven navigation and DAX measures.',
    sections: [
      {
        title: 'Project Purpose',
        content: 'Provides clinical practitioners and healthcare administrators with an intuitive panoramic view of patient vitals across different bodily systems (Heart, Blood, Lungs, Smoker Cohorts, and Overall Wellness).'
      },
      {
        title: 'Advanced DAX & Data Modeling',
        content: 'Engineered custom DAX measures for real-time risk stratification, moving averages for arterial pressure, compliance ratios, and cohort segmentation based on lifestyle risk markers.'
      },
      {
        title: 'Bookmark-Driven UX Architecture',
        content: 'Eliminated page load delays and visual disorientation by organizing multi-system views within a unified canvas via Power BI selection panes and synchronized bookmark groups.'
      }
    ]
  },
  aqi: {
    title: 'AQI India: AI Hotspot Deep Learning Analysis',
    category: 'Big Data & Deep Learning',
    github: 'https://github.com/vishalm111/AQI-India-AI-Hotspot-Analysis',
    summary: 'Deep learning exploratory investigation of 235,785 official Government of India air quality records.',
    sections: [
      {
        title: 'Scope & Data Engineering',
        content: 'Ingested and cleansed 235,785 hourly telemetry records spanning multiple metropolitan air quality index monitoring stations across India. Imputed missing sensor signals and normalized seasonal meteorological variables.'
      },
      {
        title: 'Analytical & Deep Learning Modeling',
        content: 'Modeled the spatial-temporal dispersion of PM2.5, PM10, Nitrogen Dioxide (NO2), and Sulphur Dioxide (SO2). Applied deep learning neural architectures to model non-linear interactions between wind speed, temperature inversion layers, and hazardous AQI spike probabilities.'
      },
      {
        title: 'Key Findings',
        content: 'Identified winter inversion temperature corridors as the primary catalyst for multi-day hazardous air quality retention, providing concrete timelines for targeted municipal pollution restrictions.'
      }
    ]
  },
  churn: {
    title: 'Customer Churn Prediction using Artificial Neural Networks (ANN)',
    category: 'Deep Learning & Retention Analytics',
    github: 'https://github.com/vishalm111/Customer-Churn-Prediction-ANN',
    summary: 'Deep neural network classification pipeline for preemptive customer retention targeting.',
    sections: [
      {
        title: 'Architecture & Training',
        content: 'Built a multi-layer perceptron (ANN) featuring dense fully connected layers, ReLU activations, Dropout regularization (0.25), and Batch Normalization to prevent co-adaptation of weights.'
      },
      {
        title: 'Class Imbalance & Cost Optimization',
        content: 'Addressed minority churn class skew through weighted binary cross-entropy loss and precision-recall threshold tuning, ensuring operational focus is placed on highest financial-value customer segments.'
      }
    ]
  },
  friday: {
    title: 'FRIDAY: AI Voice Assistant',
    category: 'Full-Stack Generative AI',
    github: 'https://github.com/vishalm111/FRIDAY-AI-Assistant',
    summary: 'Real-time conversational voice assistant combining React, Node.js, and Groq LLM inference.',
    sections: [
      {
        title: 'Architecture Overview',
        content: 'Connects a browser-native voice recording layer (Web Speech API) to a secure Node.js proxy server that interfaces with ultra-low latency Groq LLM endpoints, piping conversational audio back through native speech synthesis.'
      },
      {
        title: 'Key Achievements',
        content: 'Sub-second conversational turnaround, robust conversational context memory, and graceful fallbacks for background audio interference.'
      }
    ]
  },
  loan: {
    title: 'Loan Approval Prediction ML System',
    category: 'Supervised Machine Learning',
    github: 'https://github.com/vishalm111/Loan-Approval-Prediction-ML',
    summary: 'Machine learning classification suite for automated credit risk underwriting.',
    sections: [
      {
        title: 'Underwriting Methodology',
        content: 'Benchmarked Logistic Regression, Decision Trees, Random Forests, and Gradient Boosting on applicant financial profiles, prioritizing the minimization of Type II errors (defaulting loans approved).'
      }
    ]
  },
  insurance: {
    title: 'Medical Insurance Charges Regression Analysis',
    category: 'Statistical Analysis & Feature Selection',
    github: 'https://github.com/vishalm111/Medical-Insurance-Regression',
    summary: 'Exploratory data analysis and multi-variable linear regression on healthcare insurance charges.',
    sections: [
      {
        title: 'Methodology',
        content: 'Investigated non-linear interaction terms between BMI categories and smoking status, verified regression assumptions (homoscedasticity, normality of residuals), and quantified premium escalation multipliers.'
      }
    ]
  },
  netflix: {
    title: 'Netflix Global Content Catalog EDA',
    category: 'Exploratory Data Analysis',
    github: 'https://github.com/vishalm111/Netflix-EDA',
    summary: 'Business intelligence and exploratory study of Netflix movies and TV shows.',
    sections: [
      {
        title: 'Key Insights',
        content: 'Mapped the acceleration of international original productions, identified runtime distribution shifts toward serialized drama, and visualized regional catalog diversity.'
      }
    ]
  },
  titanic: {
    title: 'Titanic Survival Pattern Predictive EDA',
    category: 'Statistical Pipeline & EDA',
    github: 'https://github.com/vishalm111/Titanic-EDA',
    summary: 'Thorough statistical exploration uncovering survival determinants on the Titanic passenger manifest.',
    sections: [
      {
        title: 'Analytical Rigor',
        content: 'Feature engineered title honorifics, family size metrics, and fare quantile brackets to quantify the intersection of socioeconomic status, age, and evacuation outcomes.'
      }
    ]
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');
  const modalGithubLink = document.getElementById('modalGithubLink');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const deepDiveBtns = document.querySelectorAll('.deep-dive-btn');

  if (!modal) return;

  function openModal(projectId) {
    const details = PROJECT_DETAILS[projectId];
    if (!details) return;

    modalTitle.textContent = details.title;
    modalCategory.textContent = details.category;
    modalGithubLink.href = details.github;

    let bodyHtml = `<p class="modal-summary"><strong>Overview:</strong> ${details.summary}</p>`;

    details.sections.forEach(sec => {
      bodyHtml += `
        <div class="modal-section">
          <h4 class="modal-section-title">▸ ${sec.title}</h4>
          <p>${sec.content}</p>
        </div>
      `;
    });

    modalBody.innerHTML = bodyHtml;
    modal.showModal();
  }

  deepDiveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.getAttribute('data-project');
      openModal(proj);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  if (dismissBtn) dismissBtn.addEventListener('click', () => modal.close());

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Interactive CropNow Sensor Stabilization Canvas Demo
   -------------------------------------------------------------------------- */
function initSensorDemo() {
  const canvas = document.getElementById('sensorChart');
  const genBtn = document.getElementById('generateNoiseBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let rawData = [];
  let smoothedData = [];
  const pointsCount = 40;
  const thresholdVal = 28; // MADP threshold line

  function generateTelemetryData() {
    rawData = [];
    smoothedData = [];
    let base = 32;

    for (let i = 0; i < pointsCount; i++) {
      // Slow diurnal downward slope simulating soil drying
      base -= 0.22;
      
      // Inject random noise + occasional huge transient spikes
      let noise = (Math.random() - 0.5) * 4.5;
      if (i === 12 || i === 26) noise += 14; // Sensor transient spike
      if (i === 33) noise -= 12; // Dropout drop

      let val = Math.max(10, Math.min(55, base + noise));
      rawData.push(val);
    }

    // Apply EWMA smoothing + median spike rejection
    let ewma = rawData[0];
    const alpha = 0.25;

    for (let i = 0; i < pointsCount; i++) {
      // 3-point local median
      const prev = i > 0 ? rawData[i - 1] : rawData[i];
      const curr = rawData[i];
      const next = i < pointsCount - 1 ? rawData[i + 1] : rawData[i];
      const median = [prev, curr, next].sort((a, b) => a - b)[1];

      ewma = alpha * median + (1 - alpha) * ewma;
      smoothedData.push(ewma);
    }

    drawChart();
  }

  function drawChart() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padX = 35;
    const padY = 25;
    const graphW = w - padX * 2;
    const graphH = h - padY * 2;

    const minVal = 10;
    const maxVal = 55;

    function getY(val) {
      return h - padY - ((val - minVal) / (maxVal - minVal)) * graphH;
    }
    function getX(idx) {
      return padX + (idx / (pointsCount - 1)) * graphW;
    }

    // Draw Grid Lines (Pitch-Black / Swiss Crimson Theme)
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    for (let v = 15; v <= 50; v += 10) {
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();

      ctx.fillStyle = '#737373';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`${v}%`, 8, y + 3);
    }

    // Draw Threshold Line (MADP 28%)
    const threshY = getY(thresholdVal);
    ctx.strokeStyle = '#52525B';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padX, threshY);
    ctx.lineTo(w - padX, threshY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText('MADP LIMIT (28%)', w - padX - 110, threshY - 6);

    // Draw Raw Noisy Sensor Line (Muted Zinc)
    ctx.strokeStyle = '#52525B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < pointsCount; i++) {
      const x = getX(i);
      const y = getY(rawData[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Stabilized Filtered Line (Bold Crimson Red)
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < pointsCount; i++) {
      const x = getX(i);
      const y = getY(smoothedData[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  generateTelemetryData();

  if (genBtn) {
    genBtn.addEventListener('click', generateTelemetryData);
  }
}

/* --------------------------------------------------------------------------
   7. Power BI Bookmark Navigator Simulator
   -------------------------------------------------------------------------- */
function initBIDemo() {
  const toggleBtns = document.querySelectorAll('.bi-toggle-btn');
  const stage = document.getElementById('biStage');
  if (!stage) return;

  const MODULES_DATA = {
    heart: {
      kpis: [
        { title: 'Average Heart Rate', val: '74 BPM', sub: 'Normal Sinus Rhythm' },
        { title: 'Systolic / Diastolic', val: '122 / 81 mmHg', sub: 'Optimal Vascular Pressure' },
        { title: 'Arrhythmia Risk Score', val: 'Low (4.2%)', sub: '10-Day Event Horizon' }
      ],
      insight: '<strong>DAX Calculated Insight:</strong> 93.8% of patients with regular cardio telemetry maintained blood pressure within target clinical boundaries.'
    },
    blood: {
      kpis: [
        { title: 'Mean Fasting Glucose', val: '98 mg/dL', sub: 'Euglycemic Baseline' },
        { title: 'Hemoglobin A1c', val: '5.4%', sub: 'Pre-Diabetes Safe Zone' },
        { title: 'Total Cholesterol', val: '184 mg/dL', sub: 'LDL/HDL Ratio: 2.1' }
      ],
      insight: '<strong>DAX Calculated Insight:</strong> Dynamic cohort slicers identify a 14.2% drop in glycemic spikes following continuous glucose monitoring interventions.'
    },
    lungs: {
      kpis: [
        { title: 'SpO2 Oxygen Saturation', val: '98.5%', sub: 'Ambient Room Air' },
        { title: 'FEV1 / FVC Ratio', val: '0.82', sub: 'Unrestricted Airway' },
        { title: 'Smoker Cohort Gap', val: '-18.4%', sub: 'Respiratory Peak Variance' }
      ],
      insight: '<strong>DAX Calculated Insight:</strong> Active smokers exhibit a statistically significant 18.4% reduction in forced vital capacity compared to non-smokers.'
    },
    overall: {
      kpis: [
        { title: 'Cohort Adherence Index', val: '91.3%', sub: 'Active Monitoring Protocol' },
        { title: 'Preventive Alert Rate', val: '2.8 / 100 pt', sub: 'Early Intervention Flag' },
        { title: 'Length of Stay Reduction', val: '-1.4 Days', sub: 'Optimized Telemetry Care' }
      ],
      insight: '<strong>DAX Calculated Insight:</strong> Multi-system bookmark integration cut clinical dashboard navigation time by 68% for attending medical officers.'
    }
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mod = btn.getAttribute('data-module');
      const data = MODULES_DATA[mod];
      if (!data) return;

      let kpisHtml = '<div class="kpi-grid">';
      data.kpis.forEach(k => {
        kpisHtml += `
          <div class="kpi-card">
            <span class="kpi-title">${k.title}</span>
            <span class="kpi-value">${k.val}</span>
            <span class="kpi-subtitle">${k.sub}</span>
          </div>
        `;
      });
      kpisHtml += '</div>';

      kpisHtml += `
        <div class="bi-insight-box">
          ${data.insight}
        </div>
      `;

      stage.innerHTML = kpisHtml;
    });
  });
}

/* --------------------------------------------------------------------------
   8. Contact Actions & Clipboard Copy
   -------------------------------------------------------------------------- */
function initContactActions() {
  const copyBtn = document.getElementById('copyProfileBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const contactForm = document.getElementById('contactForm');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = 'https://github.com/vishalm111';
      navigator.clipboard.writeText(url).then(() => {
        if (copyFeedback) {
          copyFeedback.style.display = 'inline';
          setTimeout(() => {
            copyFeedback.style.display = 'none';
          }, 2500);
        }
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value.trim() || 'Visitor';
      const email = document.getElementById('senderEmail')?.value.trim() || '';
      const subject = document.getElementById('inquiryType')?.value || 'Portfolio Contact';
      const body = document.getElementById('messageBody')?.value.trim() || '';

      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hi Vishal,\n\nMy name is ${name} (${email}).\n\n${body}\n\nBest regards,\n${name}`
      )}`;

      window.location.href = mailtoLink;
    });
  }
}
