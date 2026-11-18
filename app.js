/**
 * Vehicle Service & Fuel Mileage Logger
 * Complete Client-Side Application Core
 */

// Storage Key
const STORAGE_KEY = 'vehicle_logger_store_v1';

// App State
let state = {
  vehicles: [],
  currentVehicleId: null,
  fuelLogs: [],
  serviceLogs: [],
  reminders: [],
  theme: 'dark',
  activeTab: 'dashboard'
};

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  applyTheme(state.theme);
  renderAll();
});

// Load Data from LocalStorage or initialize defaults
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    } catch (e) {
      console.error('Failed to parse saved data', e);
      initDefaultData();
    }
  } else {
    initDefaultData();
  }

  // Ensure valid current vehicle
  if (!state.currentVehicleId && state.vehicles.length > 0) {
    state.currentVehicleId = state.vehicles[0].id;
  }
}

// Save State to LocalStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    vehicles: state.vehicles,
    currentVehicleId: state.currentVehicleId,
    fuelLogs: state.fuelLogs,
    serviceLogs: state.serviceLogs,
    reminders: state.reminders,
    theme: state.theme
  }));
}

// Generate Sample / Demo Data for rich out-of-the-box experience
function initDefaultData() {
  const v1Id = 'veh-' + Date.now();
  const v2Id = 'veh-' + (Date.now() + 1);

  const vehicle1 = {
    id: v1Id,
    name: 'Toyota RAV4 Hybrid',
    type: 'suv',
    make: 'Toyota',
    model: 'RAV4 Hybrid XSE',
    year: 2024,
    licensePlate: 'ABC-4892',
    vin: '4T3BWRFV1RU123456',
    fuelType: 'hybrid',
    tankCapacity: 55,
    initialOdometer: 14200,
    distanceUnit: 'km',
    fuelUnit: 'L',
    efficiencyUnit: 'km/L',
    currency: '$',
    notes: 'Primary family vehicle, 2.5L AWD Hybrid'
  };

  const vehicle2 = {
    id: v2Id,
    name: 'Honda CB650R',
    type: 'motorcycle',
    make: 'Honda',
    model: 'CB650R Neo Sports',
    year: 2023,
    licensePlate: 'MOTO-99',
    vin: 'JH2RC97A7MK000123',
    fuelType: 'petrol',
    tankCapacity: 15.4,
    initialOdometer: 6100,
    distanceUnit: 'km',
    fuelUnit: 'L',
    efficiencyUnit: 'km/L',
    currency: '$',
    notes: 'Weekend commuter bike'
  };

  // Sample fuel logs for vehicle 1
  const fuelLogs = [
    {
      id: 'fuel-1',
      vehicleId: v1Id,
      date: '2026-09-02',
      time: '08:30',
      odometer: 14750,
      quantity: 42.5,
      unitPrice: 1.65,
      totalCost: 70.13,
      isFullTank: true,
      isMissed: false,
      station: 'Shell V-Power',
      notes: 'Highway road trip refuel'
    },
    {
      id: 'fuel-2',
      vehicleId: v1Id,
      date: '2026-09-18',
      time: '17:45',
      odometer: 15420,
      quantity: 44.0,
      unitPrice: 1.62,
      totalCost: 71.28,
      isFullTank: true,
      isMissed: false,
      station: 'Chevron',
      notes: 'Commute and city driving'
    },
    {
      id: 'fuel-3',
      vehicleId: v1Id,
      date: '2026-10-05',
      time: '12:10',
      odometer: 16110,
      quantity: 43.8,
      unitPrice: 1.68,
      totalCost: 73.58,
      isFullTank: true,
      isMissed: false,
      station: 'Costco Gas',
      notes: 'Standard refill'
    },
    {
      id: 'fuel-4',
      vehicleId: v1Id,
      date: '2026-10-24',
      time: '19:20',
      odometer: 16790,
      quantity: 42.0,
      unitPrice: 1.64,
      totalCost: 68.88,
      isFullTank: true,
      isMissed: false,
      station: 'Shell V-Power',
      notes: 'Autumn weather commute'
    },
    {
      id: 'fuel-5',
      vehicleId: v1Id,
      date: '2026-11-12',
      time: '09:15',
      odometer: 17480,
      quantity: 41.5,
      unitPrice: 1.60,
      totalCost: 66.40,
      isFullTank: true,
      isMissed: false,
      station: 'BP Connect',
      notes: 'Recent full fill'
    }
  ];

  // Sample service logs
  const serviceLogs = [
    {
      id: 'srv-1',
      vehicleId: v1Id,
      date: '2026-06-15',
      odometer: 14200,
      category: 'oil_filter',
      title: '15,000 km Scheduled Service & Oil Change',
      serviceCenter: 'Toyota Authorized Service',
      costParts: 65,
      costLabor: 75,
      totalCost: 140,
      receiptNo: 'INV-TY-9841',
      notes: 'Full synthetic 0W-16, OEM oil filter, 21-point multi inspection'
    },
    {
      id: 'srv-2',
      vehicleId: v1Id,
      date: '2026-08-20',
      odometer: 15200,
      category: 'tires',
      title: 'Tire Rotation & Balance',
      serviceCenter: 'Discount Tire Co',
      costParts: 0,
      costLabor: 40,
      totalCost: 40,
      receiptNo: 'DT-8821',
      notes: 'Rotated front to rear cross, adjusted tire pressures to 35 PSI'
    },
    {
      id: 'srv-3',
      vehicleId: v1Id,
      date: '2026-10-10',
      odometer: 16250,
      category: 'air_cabin_filter',
      title: 'Cabin & Engine Air Filter Replacement',
      serviceCenter: 'DIY Garage',
      costParts: 38,
      costLabor: 0,
      totalCost: 38,
      receiptNo: 'AMZN-9921',
      notes: 'Installed HEPA cabin air filter & OEM engine intake filter'
    }
  ];

  // Sample reminders
  const reminders = [
    {
      id: 'rem-1',
      vehicleId: v1Id,
      title: 'Engine Oil & Filter Service',
      category: 'oil_filter',
      dueOdometer: 19200,
      dueDate: '2026-12-15',
      recurrenceKm: 10000,
      recurrenceMonths: 6,
      notes: 'Next scheduled Toyota Care service at 20k km'
    },
    {
      id: 'rem-2',
      vehicleId: v1Id,
      title: 'Tire Pressure & Tread Depth Check',
      category: 'tires',
      dueOdometer: 18000,
      dueDate: '2026-11-25',
      recurrenceKm: 5000,
      recurrenceMonths: 3,
      notes: 'Pre-winter tire check'
    },
    {
      id: 'rem-3',
      vehicleId: v1Id,
      title: 'Annual Vehicle Insurance Renewal',
      category: 'insurance_tax',
      dueOdometer: null,
      dueDate: '2027-01-10',
      recurrenceKm: null,
      recurrenceMonths: 12,
      notes: 'Compare comprehensive coverage rates'
    }
  ];

  state.vehicles = [vehicle1, vehicle2];
  state.currentVehicleId = v1Id;
  state.fuelLogs = fuelLogs;
  state.serviceLogs = serviceLogs;
  state.reminders = reminders;
  saveData();
}

// Current vehicle helper
function getCurrentVehicle() {
  return state.vehicles.find(v => v.id === state.currentVehicleId) || state.vehicles[0];
}

// Vehicle current odometer calculation
function getVehicleOdometer(vehicleId) {
  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return 0;
  let maxOdo = Number(vehicle.initialOdometer) || 0;

  state.fuelLogs
    .filter(l => l.vehicleId === vehicleId)
    .forEach(l => {
      if (Number(l.odometer) > maxOdo) maxOdo = Number(l.odometer);
    });

  state.serviceLogs
    .filter(l => l.vehicleId === vehicleId)
    .forEach(l => {
      if (Number(l.odometer) > maxOdo) maxOdo = Number(l.odometer);
    });

  return maxOdo;
}

// Process Fuel Logs with precise full-to-full consumption logic
function getProcessedFuelLogs(vehicleId) {
  const logs = state.fuelLogs
    .filter(l => l.vehicleId === vehicleId)
    .sort((a, b) => Number(a.odometer) - Number(b.odometer) || new Date(a.date) - new Date(b.date));

  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  const vOdo = vehicle ? Number(vehicle.initialOdometer) || 0 : 0;

  let lastFullOdometer = null;
  let partialVolumeAccumulator = 0;
  let prevOdometer = vOdo;

  const processed = logs.map((log, index) => {
    const odo = Number(log.odometer);
    const qty = Number(log.quantity);
    const cost = Number(log.totalCost);

    const tripDistance = index === 0 ? (odo >= prevOdometer ? odo - prevOdometer : 0) : (odo - prevOdometer);
    prevOdometer = odo;

    let efficiency = null;
    let efficiencyNote = '';

    if (log.isMissed) {
      efficiency = null;
      efficiencyNote = 'Missed refuel reset';
      lastFullOdometer = log.isFullTank ? odo : null;
      partialVolumeAccumulator = 0;
    } else if (log.isFullTank) {
      if (lastFullOdometer !== null) {
        const fullIntervalDist = odo - lastFullOdometer;
        const totalFuelUsed = partialVolumeAccumulator + qty;

        if (fullIntervalDist > 0 && totalFuelUsed > 0) {
          efficiency = fullIntervalDist / totalFuelUsed; // Base km/L or mi/gal
        }
      }
      lastFullOdometer = odo;
      partialVolumeAccumulator = 0;
    } else {
      // Partial tank
      partialVolumeAccumulator += qty;
      efficiencyNote = 'Partial fill (pending)';
    }

    const costPerDistance = tripDistance > 0 ? (cost / tripDistance) : null;

    return {
      ...log,
      tripDistance,
      efficiency,
      efficiencyNote,
      costPerDistance
    };
  });

  return processed;
}

// Calculate comprehensive Vehicle Metrics
function calculateVehicleMetrics(vehicleId) {
  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return null;

  const processedFuel = getProcessedFuelLogs(vehicleId);
  const services = state.serviceLogs.filter(s => s.vehicleId === vehicleId);
  const currentOdo = getVehicleOdometer(vehicleId);
  const initialOdo = Number(vehicle.initialOdometer) || 0;
  const totalTrackedDistance = currentOdo - initialOdo;

  // Fuel sums
  const totalFuelCost = processedFuel.reduce((sum, f) => sum + Number(f.totalCost || 0), 0);
  const totalFuelQuantity = processedFuel.reduce((sum, f) => sum + Number(f.quantity || 0), 0);

  // Efficiency stats
  const validEfficiencies = processedFuel
    .map(f => f.efficiency)
    .filter(e => typeof e === 'number' && e > 0);

  const avgEfficiency = validEfficiencies.length > 0
    ? validEfficiencies.reduce((a, b) => a + b, 0) / validEfficiencies.length
    : null;

  const bestEfficiency = validEfficiencies.length > 0 ? Math.max(...validEfficiencies) : null;
  const worstEfficiency = validEfficiencies.length > 0 ? Math.min(...validEfficiencies) : null;
  const lastEfficiency = validEfficiencies.length > 0 ? validEfficiencies[validEfficiencies.length - 1] : null;

  // Service sums
  const totalServiceCost = services.reduce((sum, s) => sum + Number(s.totalCost || 0), 0);
  const totalOverallCost = totalFuelCost + totalServiceCost;

  // Cost per km/mi
  const costPerUnitDistance = totalTrackedDistance > 0 ? (totalOverallCost / totalTrackedDistance) : null;
  const fuelCostPerUnitDistance = totalTrackedDistance > 0 ? (totalFuelCost / totalTrackedDistance) : null;

  return {
    currentOdo,
    initialOdo,
    totalTrackedDistance,
    totalFuelCost,
    totalFuelQuantity,
    avgEfficiency,
    bestEfficiency,
    worstEfficiency,
    lastEfficiency,
    totalServiceCost,
    totalOverallCost,
    costPerUnitDistance,
    fuelCostPerUnitDistance,
    fuelFillCount: processedFuel.length,
    serviceCount: services.length
  };
}

// Format Units (km/L, MPG, L/100km, etc.)
function formatEfficiency(val, unit = 'km/L') {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = Number(val);
  if (unit === 'L/100km') {
    // val is dist/fuel (km/L). Invert to L/100km: 100 / (km/L)
    const l100 = num > 0 ? (100 / num) : 0;
    return `${l100.toFixed(2)} L/100km`;
  }
  return `${num.toFixed(2)} ${unit}`;
}

function formatCurrency(val, currency = '$') {
  if (val === null || val === undefined || isNaN(val)) return `${currency}0.00`;
  return `${currency}${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDistance(val, unit = 'km') {
  if (val === null || val === undefined || isNaN(val)) return `0 ${unit}`;
  return `${Math.round(val).toLocaleString()} ${unit}`;
}

// Reminder Status evaluation
function getReminderStatus(reminder, currentOdo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let isOdoOverdue = false;
  let isOdoSoon = false;
  let remainingKm = null;

  if (reminder.dueOdometer) {
    remainingKm = reminder.dueOdometer - currentOdo;
    if (remainingKm <= 0) isOdoOverdue = true;
    else if (remainingKm <= 500) isOdoSoon = true;
  }

  let isDateOverdue = false;
  let isDateSoon = false;
  let remainingDays = null;

  if (reminder.dueDate) {
    const d = new Date(reminder.dueDate);
    d.setHours(0, 0, 0, 0);
    const diffTime = d - today;
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (remainingDays < 0) isDateOverdue = true;
    else if (remainingDays <= 15) isDateSoon = true;
  }

  if (isOdoOverdue || isDateOverdue) {
    return { status: 'OVERDUE', badgeClass: 'badge-danger', remainingKm, remainingDays };
  }
  if (isOdoSoon || isDateSoon) {
    return { status: 'DUE SOON', badgeClass: 'badge-warning', remainingKm, remainingDays };
  }
  return { status: 'GOOD', badgeClass: 'badge-success', remainingKm, remainingDays };
}

// -------------------------------------------------------------
// UI Renderers
// -------------------------------------------------------------

function renderAll() {
  renderVehicleSelector();
  renderVehicleBanner();
  renderDashboard();
  renderFuelLogsTable();
  renderServiceLogsTable();
  renderReminders();
  renderVehicleGarageList();
}

function renderVehicleSelector() {
  const select = document.getElementById('globalVehicleSelect');
  if (!select) return;
  select.innerHTML = '';

  state.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.name} (${v.year})`;
    if (v.id === state.currentVehicleId) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderVehicleBanner() {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;
  const currentOdo = getVehicleOdometer(vehicle.id);

  const container = document.getElementById('vehicleBannerContent');
  if (!container) return;

  const typeIcons = {
    car: '🚗',
    suv: '🚙',
    motorcycle: '🏍️',
    truck: '🛻',
    van: '🚐',
    electric: '⚡'
  };

  container.innerHTML = `
    <div class="vehicle-info">
      <div class="vehicle-avatar">${typeIcons[vehicle.type] || '🚗'}</div>
      <div class="vehicle-meta">
        <h2>${escapeHtml(vehicle.name)}</h2>
        <div class="vehicle-tags">
          <span class="vehicle-tag">${escapeHtml(vehicle.make)} ${escapeHtml(vehicle.model)}</span>
          <span class="vehicle-tag">Plate: ${escapeHtml(vehicle.licensePlate || 'N/A')}</span>
          <span class="vehicle-tag">Fuel: ${vehicle.fuelType.toUpperCase()}</span>
          <span class="vehicle-tag">Odo: <strong>${currentOdo.toLocaleString()} ${vehicle.distanceUnit}</strong></span>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary btn-sm" onclick="openVehicleModal('${vehicle.id}')">
        <span>⚙️ Edit Vehicle</span>
      </button>
      <button class="btn btn-primary btn-sm" onclick="openFuelModal()">
        <span>⛽ Log Fuel</span>
      </button>
      <button class="btn btn-accent btn-sm" onclick="openServiceModal()">
        <span>🔧 Log Service</span>
      </button>
    </div>
  `;
}

function renderDashboard() {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;
  const metrics = calculateVehicleMetrics(vehicle.id);
  if (!metrics) return;

  // Stat Cards
  document.getElementById('statMileage').textContent = formatEfficiency(metrics.avgEfficiency, vehicle.efficiencyUnit);
  document.getElementById('statLastMileage').textContent = formatEfficiency(metrics.lastEfficiency, vehicle.efficiencyUnit);
  
  document.getElementById('statTotalCost').textContent = formatCurrency(metrics.totalOverallCost, vehicle.currency);
  document.getElementById('statCostSplit').textContent = `Fuel: ${formatCurrency(metrics.totalFuelCost, vehicle.currency)} | Service: ${formatCurrency(metrics.totalServiceCost, vehicle.currency)}`;

  document.getElementById('statRunningCost').textContent = metrics.costPerUnitDistance !== null
    ? `${vehicle.currency}${metrics.costPerUnitDistance.toFixed(2)} / ${vehicle.distanceUnit}`
    : '—';
  
  document.getElementById('statTotalDistance').textContent = formatDistance(metrics.totalTrackedDistance, vehicle.distanceUnit);
  document.getElementById('statCurrentOdo').textContent = `Current: ${metrics.currentOdo.toLocaleString()} ${vehicle.distanceUnit}`;

  // Check reminders for next alert
  const reminders = state.reminders.filter(r => r.vehicleId === vehicle.id);
  const urgent = reminders
    .map(r => ({ ...r, ...getReminderStatus(r, metrics.currentOdo) }))
    .filter(r => r.status === 'OVERDUE' || r.status === 'DUE SOON');

  const alertBox = document.getElementById('dashboardAlertBanner');
  if (alertBox) {
    if (urgent.length > 0) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid var(--accent-amber); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <div style="display:flex; align-items:center; gap: 0.75rem;">
            <span style="font-size: 1.25rem;">⚠️</span>
            <div>
              <strong>${urgent.length} Maintenance Item(s) Need Attention:</strong>
              <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 2px;">
                ${urgent.map(u => `${escapeHtml(u.title)} (${u.status})`).join(' • ')}
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="switchTab('reminders')">View Reminders</button>
        </div>
      `;
    } else {
      alertBox.style.display = 'none';
    }
  }

  // Render Visual SVG Charts
  renderFuelTrendChart(vehicle.id);
  renderExpensesChart(vehicle.id);
  renderRecentActivity(vehicle.id);
}

// Interactive SVG Fuel Efficiency Trend Chart
function renderFuelTrendChart(vehicleId) {
  const container = document.getElementById('fuelChartContainer');
  if (!container) return;

  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  const processed = getProcessedFuelLogs(vehicleId).filter(l => l.efficiency !== null);

  if (processed.length < 2) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📈</div>
        <p>Log at least 2 full tank refuels to view your Fuel Efficiency trend chart.</p>
      </div>
    `;
    return;
  }

  const width = container.clientWidth || 600;
  const height = 240;
  const padL = 50;
  const padR = 25;
  const padT = 25;
  const padB = 40;

  const values = processed.map(p => p.efficiency);
  const minVal = Math.floor(Math.min(...values) * 0.9);
  const maxVal = Math.ceil(Math.max(...values) * 1.1);
  const range = maxVal - minVal || 1;

  const xScale = (i) => padL + (i / (processed.length - 1)) * (width - padL - padR);
  const yScale = (v) => height - padB - ((v - minVal) / range) * (height - padT - padB);

  // Points & SVG path
  const points = processed.map((p, i) => ({
    x: xScale(i),
    y: yScale(p.efficiency),
    log: p
  }));

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)},${height - padB} L ${points[0].x.toFixed(1)},${height - padB} Z`;

  // Average line
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const avgY = yScale(avg);

  // SVG String construction
  let svg = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="fuelAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="var(--border-color)" stroke-dasharray="3,3" />
      <line x1="${padL}" y1="${(padT + height - padB) / 2}" x2="${width - padR}" y2="${(padT + height - padB) / 2}" stroke="var(--border-color)" stroke-dasharray="3,3" />
      <line x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}" stroke="var(--border-color)" />

      <!-- Y Axis Labels -->
      <text x="${padL - 8}" y="${padT + 4}" fill="var(--text-dim)" font-size="11" text-anchor="end">${maxVal}</text>
      <text x="${padL - 8}" y="${avgY + 4}" fill="var(--accent-cyan)" font-size="10" text-anchor="end">avg</text>
      <text x="${padL - 8}" y="${height - padB + 4}" fill="var(--text-dim)" font-size="11" text-anchor="end">${minVal}</text>

      <!-- Average Guideline -->
      <line x1="${padL}" y1="${avgY}" x2="${width - padR}" y2="${avgY}" stroke="var(--accent-cyan)" stroke-dasharray="4,4" opacity="0.6" />

      <!-- Gradient Area -->
      <path d="${areaD}" fill="url(#fuelAreaGrad)" />

      <!-- Main Trend Line -->
      <path d="${pathD}" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Points -->
      ${points.map((pt, i) => `
        <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="var(--bg-card)" stroke="var(--accent-cyan)" stroke-width="2.5" 
          style="cursor: pointer;"
          onmouseenter="showChartTooltip(event, '${escapeHtml(pt.log.date)}', '${pt.log.efficiency.toFixed(2)} ${vehicle.efficiencyUnit}', 'Trip: ${pt.log.tripDistance} ${vehicle.distanceUnit} • ${vehicle.currency}${pt.log.totalCost}')"
          onmouseleave="hideChartTooltip()"
        />
        <text x="${pt.x}" y="${height - padB + 16}" fill="var(--text-muted)" font-size="10" text-anchor="middle">
          ${pt.log.date.slice(5)}
        </text>
      `).join('')}
    </svg>
  `;

  container.innerHTML = svg;
}

// Interactive SVG Monthly Expenses Breakdown Chart
function renderExpensesChart(vehicleId) {
  const container = document.getElementById('expenseChartContainer');
  if (!container) return;

  const vehicle = state.vehicles.find(v => v.id === vehicleId);

  // Group expenses by Month (YYYY-MM)
  const monthlyData = {};

  state.fuelLogs
    .filter(l => l.vehicleId === vehicleId)
    .forEach(l => {
      const m = (l.date || '').slice(0, 7);
      if (!m) return;
      if (!monthlyData[m]) monthlyData[m] = { fuel: 0, service: 0 };
      monthlyData[m].fuel += Number(l.totalCost) || 0;
    });

  state.serviceLogs
    .filter(l => l.vehicleId === vehicleId)
    .forEach(s => {
      const m = (s.date || '').slice(0, 7);
      if (!m) return;
      if (!monthlyData[m]) monthlyData[m] = { fuel: 0, service: 0 };
      monthlyData[m].service += Number(s.totalCost) || 0;
    });

  const sortedMonths = Object.keys(monthlyData).sort().slice(-6); // last 6 months

  if (sortedMonths.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
        <p>No expense records logged yet.</p>
      </div>
    `;
    return;
  }

  const width = container.clientWidth || 380;
  const height = 240;
  const padL = 45;
  const padR = 20;
  const padT = 20;
  const padB = 40;

  const totals = sortedMonths.map(m => (monthlyData[m].fuel + monthlyData[m].service));
  const maxCost = Math.ceil(Math.max(...totals) * 1.15) || 100;

  const availableWidth = width - padL - padR;
  const slotWidth = availableWidth / sortedMonths.length;
  const barWidth = Math.min(slotWidth * 0.5, 36);

  let svg = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
      <!-- Grid -->
      <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="var(--border-color)" stroke-dasharray="3,3" />
      <line x1="${padL}" y1="${(padT + height - padB) / 2}" x2="${width - padR}" y2="${(padT + height - padB) / 2}" stroke="var(--border-color)" stroke-dasharray="3,3" />
      <line x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}" stroke="var(--border-color)" />

      <!-- Y Axis -->
      <text x="${padL - 6}" y="${padT + 4}" fill="var(--text-dim)" font-size="10" text-anchor="end">${vehicle.currency}${maxCost}</text>
      <text x="${padL - 6}" y="${height - padB + 4}" fill="var(--text-dim)" font-size="10" text-anchor="end">0</text>

      <!-- Bars -->
      ${sortedMonths.map((m, i) => {
        const d = monthlyData[m];
        const cx = padL + i * slotWidth + slotWidth / 2;
        const x = cx - barWidth / 2;

        const fuelH = (d.fuel / maxCost) * (height - padT - padB);
        const srvH = (d.service / maxCost) * (height - padT - padB);

        const fuelY = height - padB - fuelH;
        const srvY = fuelY - srvH;

        return `
          <!-- Fuel Bar segment -->
          <rect x="${x}" y="${fuelY}" width="${barWidth}" height="${fuelH}" fill="var(--accent-blue)" rx="2"
            style="cursor: pointer;"
            onmouseenter="showChartTooltip(event, '${m}', 'Fuel: ${formatCurrency(d.fuel, vehicle.currency)}', 'Total: ${formatCurrency(d.fuel + d.service, vehicle.currency)}')"
            onmouseleave="hideChartTooltip()"
          />
          <!-- Service Bar segment -->
          ${srvH > 0 ? `
            <rect x="${x}" y="${srvY}" width="${barWidth}" height="${srvH}" fill="var(--accent-emerald)" rx="2"
              style="cursor: pointer;"
              onmouseenter="showChartTooltip(event, '${m}', 'Service: ${formatCurrency(d.service, vehicle.currency)}', 'Total: ${formatCurrency(d.fuel + d.service, vehicle.currency)}')"
              onmouseleave="hideChartTooltip()"
            />
          ` : ''}

          <!-- Month Label -->
          <text x="${cx}" y="${height - padB + 16}" fill="var(--text-muted)" font-size="10" text-anchor="middle">
            ${m.slice(5)}
          </text>
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = svg;
}

// Tooltip Helpers for Charts
let tooltipEl = null;
function showChartTooltip(e, title, val1, val2) {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip';
    document.body.appendChild(tooltipEl);
  }
  tooltipEl.innerHTML = `
    <div style="font-weight:700; color:var(--text-main); margin-bottom: 2px;">${escapeHtml(title)}</div>
    <div style="color:var(--accent-cyan); font-weight:600;">${escapeHtml(val1)}</div>
    ${val2 ? `<div style="color:var(--text-muted); font-size: 0.7rem; margin-top: 2px;">${escapeHtml(val2)}</div>` : ''}
  `;
  tooltipEl.style.display = 'block';
  tooltipEl.style.left = `${e.pageX}px`;
  tooltipEl.style.top = `${e.pageY}px`;
}

function hideChartTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}

// Recent Activity Feed
function renderRecentActivity(vehicleId) {
  const container = document.getElementById('recentActivityFeed');
  if (!container) return;

  const vehicle = state.vehicles.find(v => v.id === vehicleId);

  // Combine and sort fuel and service logs
  const fuels = state.fuelLogs.filter(f => f.vehicleId === vehicleId).map(f => ({ ...f, logType: 'fuel' }));
  const srvs = state.serviceLogs.filter(s => s.vehicleId === vehicleId).map(s => ({ ...s, logType: 'service' }));

  const merged = [...fuels, ...srvs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  if (merged.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No recent activity recorded.</p></div>`;
    return;
  }

  container.innerHTML = merged.map(item => {
    if (item.logType === 'fuel') {
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
          <div style="display:flex; align-items:center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">⛽</div>
            <div>
              <div style="font-weight:600; font-size:0.875rem;">Refuel: ${item.quantity} ${vehicle.fuelUnit} @ ${item.odometer.toLocaleString()} ${vehicle.distanceUnit}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${item.date} • ${escapeHtml(item.station || 'Gas Station')}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700; color:var(--accent-blue);">${formatCurrency(item.totalCost, vehicle.currency)}</div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
          <div style="display:flex; align-items:center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">🔧</div>
            <div>
              <div style="font-weight:600; font-size:0.875rem;">${escapeHtml(item.title)}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${item.date} • @ ${item.odometer.toLocaleString()} ${vehicle.distanceUnit}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700; color:var(--accent-emerald);">${formatCurrency(item.totalCost, vehicle.currency)}</div>
          </div>
        </div>
      `;
    }
  }).join('');
}

// -------------------------------------------------------------
// Fuel Logs Table View
// -------------------------------------------------------------
function renderFuelLogsTable() {
  const tbody = document.getElementById('fuelLogsTableBody');
  if (!tbody) return;

  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const processed = getProcessedFuelLogs(vehicle.id).reverse(); // newest first
  if (processed.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⛽</div>
          <p>No fuel logs yet. Click "Add Fuel Log" to start tracking!</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = processed.map(log => {
    const effStr = log.efficiency !== null
      ? `<span class="badge badge-info">${formatEfficiency(log.efficiency, vehicle.efficiencyUnit)}</span>`
      : `<span style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(log.efficiencyNote || '—')}</span>`;

    const tagFull = log.isFullTank
      ? `<span class="badge badge-success">Full</span>`
      : `<span class="badge badge-muted">Partial</span>`;

    const tagMissed = log.isMissed
      ? ` <span class="badge badge-danger">Missed Reset</span>`
      : '';

    return `
      <tr>
        <td><strong>${escapeHtml(log.date)}</strong> <span style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(log.time || '')}</span></td>
        <td><strong>${Number(log.odometer).toLocaleString()}</strong> ${vehicle.distanceUnit}</td>
        <td>${log.tripDistance > 0 ? `+${log.tripDistance.toLocaleString()} ${vehicle.distanceUnit}` : '—'}</td>
        <td>${Number(log.quantity).toFixed(2)} ${vehicle.fuelUnit}</td>
        <td>${vehicle.currency}${Number(log.unitPrice).toFixed(3)}</td>
        <td><strong>${formatCurrency(log.totalCost, vehicle.currency)}</strong></td>
        <td>${effStr}</td>
        <td>${tagFull}${tagMissed}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-icon" title="Edit" onclick="openFuelModal('${log.id}')">✏️</button>
            <button class="btn btn-danger btn-icon" title="Delete" onclick="deleteFuelLog('${log.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Service Logs Table View
// -------------------------------------------------------------
const SERVICE_CATEGORIES = {
  oil_filter: 'Oil & Filter',
  brakes: 'Brakes & Rotors',
  tires: 'Tires & Alignment',
  battery: 'Battery & Electrical',
  air_cabin_filter: 'Air & Cabin Filter',
  transmission: 'Transmission Fluid',
  spark_plugs: 'Spark Plugs',
  coolant: 'Coolant Flush',
  suspension: 'Suspension & Steering',
  inspection: 'General Inspection',
  wash_detailing: 'Wash & Detailing',
  insurance_tax: 'Insurance / Tax / Registration',
  repair: 'Repairs & Fixes',
  other: 'Other'
};

function renderServiceLogsTable() {
  const tbody = document.getElementById('serviceLogsTableBody');
  if (!tbody) return;

  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const logs = state.serviceLogs
    .filter(s => s.vehicleId === vehicle.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔧</div>
          <p>No maintenance logs found. Click "Add Service Record" to record maintenance.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = logs.map(s => `
    <tr>
      <td><strong>${escapeHtml(s.date)}</strong></td>
      <td><strong>${Number(s.odometer).toLocaleString()}</strong> ${vehicle.distanceUnit}</td>
      <td>
        <span class="badge badge-info">${SERVICE_CATEGORIES[s.category] || s.category}</span>
      </td>
      <td>
        <strong>${escapeHtml(s.title)}</strong>
        ${s.serviceCenter ? `<div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(s.serviceCenter)}</div>` : ''}
        ${s.notes ? `<div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">${escapeHtml(s.notes)}</div>` : ''}
      </td>
      <td>
        ${s.receiptNo ? `<code style="font-size:0.75rem; background:rgba(255,255,255,0.05); padding:2px 5px; border-radius:3px;">${escapeHtml(s.receiptNo)}</code>` : '—'}
      </td>
      <td><strong>${formatCurrency(s.totalCost, vehicle.currency)}</strong></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-icon" title="Edit" onclick="openServiceModal('${s.id}')">✏️</button>
          <button class="btn btn-danger btn-icon" title="Delete" onclick="deleteServiceLog('${s.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// -------------------------------------------------------------
// Reminders View
// -------------------------------------------------------------
function renderReminders() {
  const container = document.getElementById('remindersListContainer');
  if (!container) return;

  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const currentOdo = getVehicleOdometer(vehicle.id);
  const reminders = state.reminders.filter(r => r.vehicleId === vehicle.id);

  if (reminders.length === 0) {
    container.innerHTML = `
      <div class="empty-state col-span-2" style="grid-column: 1 / -1;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔔</div>
        <p>No maintenance reminders set. Set one up to never miss an oil change or service!</p>
        <button class="btn btn-accent btn-sm" style="margin-top: 1rem;" onclick="openReminderModal()">+ Add Reminder</button>
      </div>
    `;
    return;
  }

  // Sort: Overdue first, then Soon, then Good
  const evaluated = reminders.map(r => ({
    ...r,
    eval: getReminderStatus(r, currentOdo)
  })).sort((a, b) => {
    const order = { 'OVERDUE': 0, 'DUE SOON': 1, 'GOOD': 2 };
    return (order[a.eval.status] ?? 3) - (order[b.eval.status] ?? 3);
  });

  container.innerHTML = evaluated.map(r => {
    const cardClass = r.eval.status === 'OVERDUE' ? 'status-overdue'
                    : r.eval.status === 'DUE SOON' ? 'status-soon' : 'status-ok';

    return `
      <div class="reminder-card ${cardClass}">
        <div>
          <div class="reminder-header">
            <div>
              <div class="reminder-category">${SERVICE_CATEGORIES[r.category] || r.category}</div>
              <div class="reminder-title">${escapeHtml(r.title)}</div>
            </div>
            <span class="badge ${r.eval.badgeClass}">${r.eval.status}</span>
          </div>

          <div class="reminder-metrics">
            ${r.dueOdometer ? `
              <div class="reminder-metric-row">
                <span style="color:var(--text-muted);">Due Odometer:</span>
                <strong>${Number(r.dueOdometer).toLocaleString()} ${vehicle.distanceUnit}</strong>
              </div>
              <div class="reminder-metric-row">
                <span style="color:var(--text-muted);">Distance Remaining:</span>
                <span style="font-weight:600; color:${r.eval.remainingKm <= 0 ? 'var(--accent-rose)' : 'inherit'};">
                  ${r.eval.remainingKm <= 0 ? `${Math.abs(r.eval.remainingKm).toLocaleString()} ${vehicle.distanceUnit} OVERDUE` : `${r.eval.remainingKm.toLocaleString()} ${vehicle.distanceUnit}`}
                </span>
              </div>
            ` : ''}

            ${r.dueDate ? `
              <div class="reminder-metric-row">
                <span style="color:var(--text-muted);">Due Date:</span>
                <strong>${escapeHtml(r.dueDate)}</strong>
              </div>
              <div class="reminder-metric-row">
                <span style="color:var(--text-muted);">Time Remaining:</span>
                <span style="font-weight:600; color:${r.eval.remainingDays < 0 ? 'var(--accent-rose)' : 'inherit'};">
                  ${r.eval.remainingDays < 0 ? `${Math.abs(r.eval.remainingDays)} day(s) OVERDUE` : `${r.eval.remainingDays} day(s)`}
                </span>
              </div>
            ` : ''}

            ${r.notes ? `
              <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.4rem; padding-top:0.4rem; border-top:1px dashed var(--border-color);">
                ${escapeHtml(r.notes)}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="reminder-footer">
          <button class="btn btn-success btn-sm" onclick="completeReminder('${r.id}')" title="Log Service & Reschedule">
            ✓ Done / Log
          </button>
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn-secondary btn-icon" onclick="openReminderModal('${r.id}')" title="Edit">✏️</button>
            <button class="btn btn-danger btn-icon" onclick="deleteReminder('${r.id}')" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Vehicles Garage View
// -------------------------------------------------------------
function renderVehicleGarageList() {
  const container = document.getElementById('garageVehiclesList');
  if (!container) return;

  const typeIcons = {
    car: '🚗',
    suv: '🚙',
    motorcycle: '🏍️',
    truck: '🛻',
    van: '🚐',
    electric: '⚡'
  };

  container.innerHTML = state.vehicles.map(v => {
    const odo = getVehicleOdometer(v.id);
    const metrics = calculateVehicleMetrics(v.id);
    const isSelected = v.id === state.currentVehicleId;

    return `
      <div class="card" style="border-color:${isSelected ? 'var(--accent-cyan)' : 'var(--border-color)'};">
        <div class="card-body">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1rem;">
            <div style="display:flex; gap: 0.75rem; align-items:center;">
              <div style="font-size:2rem; width:48px; height:48px; background:rgba(255,255,255,0.05); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center;">
                ${typeIcons[v.type] || '🚗'}
              </div>
              <div>
                <h3 style="font-size:1.15rem; font-weight:700;">${escapeHtml(v.name)}</h3>
                <div style="font-size:0.8rem; color:var(--text-muted);">${v.year} ${escapeHtml(v.make)} ${escapeHtml(v.model)}</div>
              </div>
            </div>
            ${isSelected ? '<span class="badge badge-success">Active</span>' : ''}
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; font-size:0.85rem; margin-bottom:1rem; padding:0.75rem; background:rgba(0,0,0,0.1); border-radius:var(--radius-md);">
            <div><span style="color:var(--text-muted);">Plate:</span> <strong>${escapeHtml(v.licensePlate || 'N/A')}</strong></div>
            <div><span style="color:var(--text-muted);">Fuel:</span> <strong>${v.fuelType.toUpperCase()}</strong></div>
            <div><span style="color:var(--text-muted);">Odometer:</span> <strong>${odo.toLocaleString()} ${v.distanceUnit}</strong></div>
            <div><span style="color:var(--text-muted);">Avg Mileage:</span> <strong>${formatEfficiency(metrics.avgEfficiency, v.efficiencyUnit)}</strong></div>
            <div><span style="color:var(--text-muted);">Fuel Logs:</span> <strong>${metrics.fuelFillCount}</strong></div>
            <div><span style="color:var(--text-muted);">Service Logs:</span> <strong>${metrics.serviceCount}</strong></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
            ${!isSelected ? `
              <button class="btn btn-secondary btn-sm" onclick="switchVehicle('${v.id}')">Select Vehicle</button>
            ` : '<span></span>'}
            <div style="display:flex; gap:0.35rem;">
              <button class="btn btn-secondary btn-sm" onclick="openVehicleModal('${v.id}')">Edit</button>
              ${state.vehicles.length > 1 ? `
                <button class="btn btn-danger btn-sm" onclick="deleteVehicle('${v.id}')">Delete</button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Modal Form Openers & Handlers
// -------------------------------------------------------------

// Fuel Modal
function openFuelModal(logId = null) {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const form = document.getElementById('fuelLogForm');
  form.reset();

  const titleEl = document.getElementById('fuelModalTitle');
  const idInput = document.getElementById('fuelLogId');
  const dateInput = document.getElementById('fuelDate');
  const timeInput = document.getElementById('fuelTime');
  const odoInput = document.getElementById('fuelOdometer');
  const qtyInput = document.getElementById('fuelQuantity');
  const priceInput = document.getElementById('fuelUnitPrice');
  const costInput = document.getElementById('fuelTotalCost');
  const fullCheck = document.getElementById('fuelIsFull');
  const missedCheck = document.getElementById('fuelIsMissed');
  const stationInput = document.getElementById('fuelStation');
  const notesInput = document.getElementById('fuelNotes');

  // Labels with unit
  document.getElementById('fuelOdoLabel').textContent = `Odometer (${vehicle.distanceUnit})`;
  document.getElementById('fuelQtyLabel').textContent = `Volume (${vehicle.fuelUnit})`;
  document.getElementById('fuelPriceLabel').textContent = `Unit Price (${vehicle.currency}/${vehicle.fuelUnit})`;
  document.getElementById('fuelCostLabel').textContent = `Total Cost (${vehicle.currency})`;

  if (logId) {
    const log = state.fuelLogs.find(l => l.id === logId);
    if (!log) return;
    titleEl.textContent = 'Edit Fuel Log';
    idInput.value = log.id;
    dateInput.value = log.date;
    timeInput.value = log.time || '';
    odoInput.value = log.odometer;
    qtyInput.value = log.quantity;
    priceInput.value = log.unitPrice;
    costInput.value = log.totalCost;
    fullCheck.checked = log.isFullTank !== false;
    missedCheck.checked = !!log.isMissed;
    stationInput.value = log.station || '';
    notesInput.value = log.notes || '';
  } else {
    titleEl.textContent = 'Add Fuel Log';
    idInput.value = '';
    const now = new Date();
    dateInput.value = now.toISOString().slice(0, 10);
    timeInput.value = now.toTimeString().slice(0, 5);
    const currOdo = getVehicleOdometer(vehicle.id);
    odoInput.value = currOdo > 0 ? currOdo : '';
    fullCheck.checked = true;
    missedCheck.checked = false;
  }

  openModal('fuelModal');
}

function handleFuelSubmit(e) {
  e.preventDefault();
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const id = document.getElementById('fuelLogId').value;
  const date = document.getElementById('fuelDate').value;
  const time = document.getElementById('fuelTime').value;
  const odometer = parseFloat(document.getElementById('fuelOdometer').value);
  const quantity = parseFloat(document.getElementById('fuelQuantity').value);
  const unitPrice = parseFloat(document.getElementById('fuelUnitPrice').value);
  const totalCost = parseFloat(document.getElementById('fuelTotalCost').value);
  const isFullTank = document.getElementById('fuelIsFull').checked;
  const isMissed = document.getElementById('fuelIsMissed').checked;
  const station = document.getElementById('fuelStation').value.trim();
  const notes = document.getElementById('fuelNotes').value.trim();

  if (isNaN(odometer) || isNaN(quantity) || isNaN(totalCost)) {
    alert('Please provide valid numbers for Odometer, Quantity and Total Cost.');
    return;
  }

  if (id) {
    const idx = state.fuelLogs.findIndex(l => l.id === id);
    if (idx !== -1) {
      state.fuelLogs[idx] = {
        ...state.fuelLogs[idx],
        date, time, odometer, quantity, unitPrice, totalCost, isFullTank, isMissed, station, notes
      };
    }
  } else {
    state.fuelLogs.push({
      id: 'fuel-' + Date.now(),
      vehicleId: vehicle.id,
      date, time, odometer, quantity, unitPrice, totalCost, isFullTank, isMissed, station, notes
    });
  }

  saveData();
  closeModal('fuelModal');
  renderAll();
}

function deleteFuelLog(id) {
  if (!confirm('Are you sure you want to delete this fuel log?')) return;
  state.fuelLogs = state.fuelLogs.filter(l => l.id !== id);
  saveData();
  renderAll();
}

// Service Modal
function openServiceModal(serviceId = null) {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const form = document.getElementById('serviceLogForm');
  form.reset();

  const titleEl = document.getElementById('serviceModalTitle');
  const idInput = document.getElementById('serviceLogId');
  const dateInput = document.getElementById('serviceDate');
  const odoInput = document.getElementById('serviceOdometer');
  const catInput = document.getElementById('serviceCategory');
  const nameInput = document.getElementById('serviceTitle');
  const centerInput = document.getElementById('serviceCenter');
  const partsInput = document.getElementById('serviceCostParts');
  const laborInput = document.getElementById('serviceCostLabor');
  const totalInput = document.getElementById('serviceTotalCost');
  const receiptInput = document.getElementById('serviceReceipt');
  const notesInput = document.getElementById('serviceNotes');

  document.getElementById('serviceOdoLabel').textContent = `Odometer (${vehicle.distanceUnit})`;
  document.getElementById('serviceTotalCostLabel').textContent = `Total Cost (${vehicle.currency})`;

  if (serviceId) {
    const s = state.serviceLogs.find(item => item.id === serviceId);
    if (!s) return;
    titleEl.textContent = 'Edit Service Record';
    idInput.value = s.id;
    dateInput.value = s.date;
    odoInput.value = s.odometer;
    catInput.value = s.category;
    nameInput.value = s.title;
    centerInput.value = s.serviceCenter || '';
    partsInput.value = s.costParts || 0;
    laborInput.value = s.costLabor || 0;
    totalInput.value = s.totalCost || 0;
    receiptInput.value = s.receiptNo || '';
    notesInput.value = s.notes || '';
  } else {
    titleEl.textContent = 'Add Service Record';
    idInput.value = '';
    dateInput.value = new Date().toISOString().slice(0, 10);
    const currOdo = getVehicleOdometer(vehicle.id);
    odoInput.value = currOdo > 0 ? currOdo : '';
    partsInput.value = '';
    laborInput.value = '';
    totalInput.value = '';
  }

  openModal('serviceModal');
}

function handleServiceSubmit(e) {
  e.preventDefault();
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const id = document.getElementById('serviceLogId').value;
  const date = document.getElementById('serviceDate').value;
  const odometer = parseFloat(document.getElementById('serviceOdometer').value);
  const category = document.getElementById('serviceCategory').value;
  const title = document.getElementById('serviceTitle').value.trim();
  const serviceCenter = document.getElementById('serviceCenter').value.trim();
  const costParts = parseFloat(document.getElementById('serviceCostParts').value) || 0;
  const costLabor = parseFloat(document.getElementById('serviceCostLabor').value) || 0;
  const totalCost = parseFloat(document.getElementById('serviceTotalCost').value) || (costParts + costLabor);
  const receiptNo = document.getElementById('serviceReceipt').value.trim();
  const notes = document.getElementById('serviceNotes').value.trim();

  if (isNaN(odometer) || !title) {
    alert('Please enter a valid Odometer reading and Service Title.');
    return;
  }

  if (id) {
    const idx = state.serviceLogs.findIndex(s => s.id === id);
    if (idx !== -1) {
      state.serviceLogs[idx] = {
        ...state.serviceLogs[idx],
        date, odometer, category, title, serviceCenter, costParts, costLabor, totalCost, receiptNo, notes
      };
    }
  } else {
    state.serviceLogs.push({
      id: 'srv-' + Date.now(),
      vehicleId: vehicle.id,
      date, odometer, category, title, serviceCenter, costParts, costLabor, totalCost, receiptNo, notes
    });
  }

  saveData();
  closeModal('serviceModal');
  renderAll();
}

function deleteServiceLog(id) {
  if (!confirm('Are you sure you want to delete this service record?')) return;
  state.serviceLogs = state.serviceLogs.filter(s => s.id !== id);
  saveData();
  renderAll();
}

// Reminder Modal
function openReminderModal(reminderId = null) {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const form = document.getElementById('reminderForm');
  form.reset();

  const titleEl = document.getElementById('reminderModalTitle');
  const idInput = document.getElementById('reminderId');
  const titleInput = document.getElementById('reminderTitle');
  const catInput = document.getElementById('reminderCategory');
  const odoInput = document.getElementById('reminderDueOdo');
  const dateInput = document.getElementById('reminderDueDate');
  const recKmInput = document.getElementById('reminderRecKm');
  const recMonthsInput = document.getElementById('reminderRecMonths');
  const notesInput = document.getElementById('reminderNotes');

  document.getElementById('reminderDueOdoLabel').textContent = `Due at Odometer (${vehicle.distanceUnit})`;
  document.getElementById('reminderRecKmLabel').textContent = `Recurrence Distance (${vehicle.distanceUnit})`;

  if (reminderId) {
    const r = state.reminders.find(item => item.id === reminderId);
    if (!r) return;
    titleEl.textContent = 'Edit Reminder';
    idInput.value = r.id;
    titleInput.value = r.title;
    catInput.value = r.category;
    odoInput.value = r.dueOdometer || '';
    dateInput.value = r.dueDate || '';
    recKmInput.value = r.recurrenceKm || '';
    recMonthsInput.value = r.recurrenceMonths || '';
    notesInput.value = r.notes || '';
  } else {
    titleEl.textContent = 'Add Maintenance Reminder';
    idInput.value = '';
    const currOdo = getVehicleOdometer(vehicle.id);
    odoInput.value = currOdo > 0 ? (currOdo + 5000) : '';
  }

  openModal('reminderModal');
}

function handleReminderSubmit(e) {
  e.preventDefault();
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const id = document.getElementById('reminderId').value;
  const title = document.getElementById('reminderTitle').value.trim();
  const category = document.getElementById('reminderCategory').value;
  const dueOdometer = parseFloat(document.getElementById('reminderDueOdo').value) || null;
  const dueDate = document.getElementById('reminderDueDate').value || null;
  const recurrenceKm = parseFloat(document.getElementById('reminderRecKm').value) || null;
  const recurrenceMonths = parseInt(document.getElementById('reminderRecMonths').value, 10) || null;
  const notes = document.getElementById('reminderNotes').value.trim();

  if (!title) {
    alert('Please enter a reminder title.');
    return;
  }
  if (!dueOdometer && !dueDate) {
    alert('Please specify either a Due Odometer reading or a Due Date.');
    return;
  }

  if (id) {
    const idx = state.reminders.findIndex(r => r.id === id);
    if (idx !== -1) {
      state.reminders[idx] = {
        ...state.reminders[idx],
        title, category, dueOdometer, dueDate, recurrenceKm, recurrenceMonths, notes
      };
    }
  } else {
    state.reminders.push({
      id: 'rem-' + Date.now(),
      vehicleId: vehicle.id,
      title, category, dueOdometer, dueDate, recurrenceKm, recurrenceMonths, notes
    });
  }

  saveData();
  closeModal('reminderModal');
  renderAll();
}

function deleteReminder(id) {
  if (!confirm('Are you sure you want to delete this reminder?')) return;
  state.reminders = state.reminders.filter(r => r.id !== id);
  saveData();
  renderAll();
}

// Complete Reminder & Advance to next interval
function completeReminder(id) {
  const reminder = state.reminders.find(r => r.id === id);
  if (!reminder) return;
  const vehicle = getCurrentVehicle();
  const currentOdo = getVehicleOdometer(vehicle.id);

  const confirmLog = confirm(`Mark "${reminder.title}" as completed?\n\nWould you like to advance this reminder to its next scheduled interval?`);
  if (!confirmLog) return;

  // Compute next due targets
  if (reminder.recurrenceKm && reminder.dueOdometer) {
    reminder.dueOdometer = currentOdo + reminder.recurrenceKm;
  }
  if (reminder.recurrenceMonths) {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + reminder.recurrenceMonths);
    reminder.dueDate = nextDate.toISOString().slice(0, 10);
  }

  saveData();
  renderAll();
}

// Vehicle Modal
function openVehicleModal(vehicleId = null) {
  const form = document.getElementById('vehicleForm');
  form.reset();

  const titleEl = document.getElementById('vehicleModalTitle');
  const idInput = document.getElementById('vehicleId');
  const nameInput = document.getElementById('vehicleName');
  const typeInput = document.getElementById('vehicleType');
  const makeInput = document.getElementById('vehicleMake');
  const modelInput = document.getElementById('vehicleModel');
  const yearInput = document.getElementById('vehicleYear');
  const plateInput = document.getElementById('vehiclePlate');
  const vinInput = document.getElementById('vehicleVin');
  const fuelTypeInput = document.getElementById('vehicleFuelType');
  const capacityInput = document.getElementById('vehicleCapacity');
  const odoInput = document.getElementById('vehicleInitialOdo');
  const distUnitInput = document.getElementById('vehicleDistUnit');
  const fuelUnitInput = document.getElementById('vehicleFuelUnit');
  const effUnitInput = document.getElementById('vehicleEffUnit');
  const currInput = document.getElementById('vehicleCurrency');
  const notesInput = document.getElementById('vehicleNotes');

  if (vehicleId) {
    const v = state.vehicles.find(item => item.id === vehicleId);
    if (!v) return;
    titleEl.textContent = 'Edit Vehicle';
    idInput.value = v.id;
    nameInput.value = v.name;
    typeInput.value = v.type;
    makeInput.value = v.make;
    modelInput.value = v.model;
    yearInput.value = v.year;
    plateInput.value = v.licensePlate || '';
    vinInput.value = v.vin || '';
    fuelTypeInput.value = v.fuelType;
    capacityInput.value = v.tankCapacity || '';
    odoInput.value = v.initialOdometer || 0;
    distUnitInput.value = v.distanceUnit || 'km';
    fuelUnitInput.value = v.fuelUnit || 'L';
    effUnitInput.value = v.efficiencyUnit || 'km/L';
    currInput.value = v.currency || '$';
    notesInput.value = v.notes || '';
  } else {
    titleEl.textContent = 'Add New Vehicle';
    idInput.value = '';
    nameInput.value = '';
    yearInput.value = new Date().getFullYear();
    odoInput.value = 0;
    currInput.value = '$';
  }

  openModal('vehicleModal');
}

function handleVehicleSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('vehicleId').value;
  const name = document.getElementById('vehicleName').value.trim();
  const type = document.getElementById('vehicleType').value;
  const make = document.getElementById('vehicleMake').value.trim();
  const model = document.getElementById('vehicleModel').value.trim();
  const year = parseInt(document.getElementById('vehicleYear').value, 10) || new Date().getFullYear();
  const licensePlate = document.getElementById('vehiclePlate').value.trim();
  const vin = document.getElementById('vehicleVin').value.trim();
  const fuelType = document.getElementById('vehicleFuelType').value;
  const tankCapacity = parseFloat(document.getElementById('vehicleCapacity').value) || null;
  const initialOdometer = parseFloat(document.getElementById('vehicleInitialOdo').value) || 0;
  const distanceUnit = document.getElementById('vehicleDistUnit').value;
  const fuelUnit = document.getElementById('vehicleFuelUnit').value;
  const efficiencyUnit = document.getElementById('vehicleEffUnit').value;
  const currency = document.getElementById('vehicleCurrency').value.trim() || '$';
  const notes = document.getElementById('vehicleNotes').value.trim();

  if (!name) {
    alert('Please provide a vehicle name.');
    return;
  }

  if (id) {
    const idx = state.vehicles.findIndex(v => v.id === id);
    if (idx !== -1) {
      state.vehicles[idx] = {
        ...state.vehicles[idx],
        name, type, make, model, year, licensePlate, vin, fuelType, tankCapacity,
        initialOdometer, distanceUnit, fuelUnit, efficiencyUnit, currency, notes
      };
    }
  } else {
    const newId = 'veh-' + Date.now();
    state.vehicles.push({
      id: newId,
      name, type, make, model, year, licensePlate, vin, fuelType, tankCapacity,
      initialOdometer, distanceUnit, fuelUnit, efficiencyUnit, currency, notes
    });
    state.currentVehicleId = newId;
  }

  saveData();
  closeModal('vehicleModal');
  renderAll();
}

function deleteVehicle(id) {
  if (state.vehicles.length <= 1) {
    alert('You cannot delete your only vehicle.');
    return;
  }
  if (!confirm('Are you sure you want to delete this vehicle and all its associated logs? This cannot be undone.')) return;

  state.vehicles = state.vehicles.filter(v => v.id !== id);
  state.fuelLogs = state.fuelLogs.filter(f => f.vehicleId !== id);
  state.serviceLogs = state.serviceLogs.filter(s => s.vehicleId !== id);
  state.reminders = state.reminders.filter(r => r.vehicleId !== id);

  if (state.currentVehicleId === id) {
    state.currentVehicleId = state.vehicles[0].id;
  }

  saveData();
  renderAll();
}

function switchVehicle(id) {
  state.currentVehicleId = id;
  saveData();
  renderAll();
}

// -------------------------------------------------------------
// Data Export & Import Handlers
// -------------------------------------------------------------

function exportDataJSON() {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    vehicles: state.vehicles,
    fuelLogs: state.fuelLogs,
    serviceLogs: state.serviceLogs,
    reminders: state.reminders
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `vehicle_logger_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importDataJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.vehicles)) {
        throw new Error('Invalid format: vehicles array missing');
      }
      if (confirm('Importing will replace current data. Are you sure?')) {
        state.vehicles = data.vehicles || [];
        state.fuelLogs = data.fuelLogs || [];
        state.serviceLogs = data.serviceLogs || [];
        state.reminders = data.reminders || [];
        state.currentVehicleId = state.vehicles[0]?.id || null;
        saveData();
        renderAll();
        alert('Data imported successfully!');
      }
    } catch (err) {
      alert('Error importing JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function exportFuelLogsCSV() {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const processed = getProcessedFuelLogs(vehicle.id);
  let csv = `Date,Time,Odometer(${vehicle.distanceUnit}),TripDistance,Quantity(${vehicle.fuelUnit}),UnitPrice,TotalCost,FullTank,Missed,Efficiency(${vehicle.efficiencyUnit}),Station,Notes\n`;

  processed.forEach(l => {
    const eff = l.efficiency !== null ? l.efficiency.toFixed(2) : '';
    csv += `"${l.date}","${l.time || ''}",${l.odometer},${l.tripDistance},${l.quantity},${l.unitPrice},${l.totalCost},${l.isFullTank},${l.isMissed},"${eff}","${(l.station || '').replace(/"/g, '""')}","${(l.notes || '').replace(/"/g, '""')}"\n`;
  });

  downloadCSV(csv, `${vehicle.name.replace(/\s+/g, '_')}_fuel_logs.csv`);
}

function exportServiceLogsCSV() {
  const vehicle = getCurrentVehicle();
  if (!vehicle) return;

  const logs = state.serviceLogs.filter(s => s.vehicleId === vehicle.id);
  let csv = `Date,Odometer(${vehicle.distanceUnit}),Category,Title,ServiceCenter,PartsCost,LaborCost,TotalCost,ReceiptNo,Notes\n`;

  logs.forEach(s => {
    csv += `"${s.date}",${s.odometer},"${s.category}","${(s.title || '').replace(/"/g, '""')}","${(s.serviceCenter || '').replace(/"/g, '""')}",${s.costParts || 0},${s.costLabor || 0},${s.totalCost || 0},"${s.receiptNo || ''}","${(s.notes || '').replace(/"/g, '""')}"\n`;
  });

  downloadCSV(csv, `${vehicle.name.replace(/\s+/g, '_')}_service_logs.csv`);
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function clearAllData() {
  if (confirm('CAUTION: This will delete ALL vehicles, fuel logs, service history, and reminders. Are you sure?')) {
    localStorage.removeItem(STORAGE_KEY);
    state.vehicles = [];
    state.fuelLogs = [];
    state.serviceLogs = [];
    state.reminders = [];
    state.currentVehicleId = null;
    initDefaultData();
    renderAll();
    alert('Application reset to initial demo state.');
  }
}

// -------------------------------------------------------------
// UI Navigation, Modals & Utility Handlers
// -------------------------------------------------------------

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  // Re-render chart on tab view to adapt to container layout
  if (tabId === 'dashboard') {
    const v = getCurrentVehicle();
    if (v) {
      renderFuelTrendChart(v.id);
      renderExpensesChart(v.id);
    }
  }
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeToggleBtn');
  if (icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
  saveData();
}

function toggleTheme() {
  applyTheme(state.theme === 'light' ? 'dark' : 'light');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Setup Event Listeners
function setupEventListeners() {
  // Vehicle selector
  document.getElementById('globalVehicleSelect')?.addEventListener('change', (e) => {
    switchVehicle(e.target.value);
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Forms
  document.getElementById('fuelLogForm')?.addEventListener('submit', handleFuelSubmit);
  document.getElementById('serviceLogForm')?.addEventListener('submit', handleServiceSubmit);
  document.getElementById('reminderForm')?.addEventListener('submit', handleReminderSubmit);
  document.getElementById('vehicleForm')?.addEventListener('submit', handleVehicleSubmit);

  // Auto-calculate Fuel Total and Unit Price
  const qtyInput = document.getElementById('fuelQuantity');
  const priceInput = document.getElementById('fuelUnitPrice');
  const costInput = document.getElementById('fuelTotalCost');

  if (qtyInput && priceInput && costInput) {
    qtyInput.addEventListener('input', () => {
      const q = parseFloat(qtyInput.value);
      const p = parseFloat(priceInput.value);
      if (q > 0 && p > 0) costInput.value = (q * p).toFixed(2);
    });
    priceInput.addEventListener('input', () => {
      const q = parseFloat(qtyInput.value);
      const p = parseFloat(priceInput.value);
      if (q > 0 && p > 0) costInput.value = (q * p).toFixed(2);
    });
    costInput.addEventListener('input', () => {
      const q = parseFloat(qtyInput.value);
      const c = parseFloat(costInput.value);
      if (q > 0 && c > 0) priceInput.value = (c / q).toFixed(3);
    });
  }

  // Auto-calculate Service Total Cost
  const sParts = document.getElementById('serviceCostParts');
  const sLabor = document.getElementById('serviceCostLabor');
  const sTotal = document.getElementById('serviceTotalCost');
  if (sParts && sLabor && sTotal) {
    const updateSTotal = () => {
      const p = parseFloat(sParts.value) || 0;
      const l = parseFloat(sLabor.value) || 0;
      sTotal.value = (p + l).toFixed(2);
    };
    sParts.addEventListener('input', updateSTotal);
    sLabor.addEventListener('input', updateSTotal);
  }

  // Theme Toggle
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Modal backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // Window resize re-renders chart
  window.addEventListener('resize', () => {
    const v = getCurrentVehicle();
    if (v && state.activeTab === 'dashboard') {
      renderFuelTrendChart(v.id);
      renderExpensesChart(v.id);
    }
  });

  // JSON File Import
  document.getElementById('jsonImportInput')?.addEventListener('change', (e) => {
    importDataJSON(e.target.files[0]);
  });
}
