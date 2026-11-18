# 🚗 PitStop - Vehicle Service & Fuel Mileage Logger

A modern, offline-first web application designed for car, motorcycle, truck, and fleet owners to log fuel refills, monitor true fuel efficiency, track maintenance and repair history, and stay on top of scheduled service reminders.

---

## 🌟 Key Features

### 1. ⛽ Precise Fuel Mileage & Economy Tracking
- **Full-Tank & Partial-Tank Algorithm**: Accurately calculates fuel economy across fill-ups. If you perform partial fill-ups, the algorithm holds the volume and resolves the true economy once the next full fill occurs (standard automotive industry standard as used by Fuelly/Drivvo).
- **Missed Fill-Up Handling**: Flagging a missed fill-up resets the baseline odometer to prevent distorted economy numbers.
- **Smart Unit Calculations**: Automatically calculates total cost from quantity and unit price, or vice-versa.
- **Multi-Unit Support**: Supports `km/L`, `L/100km`, `MPG (US)`, `MPG (UK)`, and `km/kWh` for EVs.

### 2. 🔧 Comprehensive Service & Maintenance Logbook
- **Detailed Maintenance Records**: Categorized by Oil & Filter, Brakes, Tires, Battery, Air Filters, Transmission, Spark Plugs, Coolant, Suspension, Inspection, Bodywork, and custom items.
- **Cost Breakdown**: Tracks Parts Cost vs Labor Cost separately with automated subtotal calculation.
- **Receipt & Shop Tracking**: Store invoice numbers, service center/mechanic details, and specific parts specifications (e.g., oil viscosity, filter part numbers).
- **Printable Service History**: Click **"Print Service Book"** to generate a clean, official service history record for vehicle resale or insurance.

### 3. 🔔 Dual-Trigger Maintenance Reminders
- **Distance & Time Triggers**: Set service intervals triggered by odometer (e.g., every 10,000 km) and/or by calendar date (e.g., every 6 months / 1 year).
- **Smart Status Alerts**: Visual indicators categorize tasks as:
  - 🟢 **GOOD**: Well within schedule.
  - 🟡 **DUE SOON**: Within 500 km or 15 days.
  - 🔴 **OVERDUE**: Past due date or odometer reading.
- **One-Click Completion & Recurring Cycle**: Marking a reminder as done automatically rolls forward the interval to the next scheduled maintenance target.

### 4. 📊 Native SVG Telemetry & Analytics Charts
- **Fuel Mileage Trend**: Smooth interactive trend curve with moving average guideline, data points, and hover tooltips.
- **Monthly Expenses Breakdown**: Visual stacked bar chart tracking Fuel vs Service expenses over time.
- **Running Cost per km/mile**: Real-time calculation of overall vehicle operating costs.
- **100% Offline SVG Engine**: No third-party canvas or remote CDN dependencies required—instant load times and zero network lag.

### 5. 🚘 Multi-Vehicle Garage
- Switch effortlessly between cars, motorcycles, SUVs, and commercial vehicles.
- Custom odometer units (`km` vs `mi`), fuel units (`L` vs `gal`), and local currency symbols (`$`, `₹`, `€`, `£`, etc.).

### 6. 💾 100% Data Privacy & Full Portability
- **Offline First**: All data is saved directly in your browser's `localStorage`.
- **JSON Backup & Restore**: Export complete vehicle records, logs, and reminders to a single `.json` file for backup or cross-device transfer.
- **CSV Data Export**: Export Fuel Logs and Service Logs directly to CSV format compatible with Microsoft Excel, Apple Numbers, and Google Sheets.
- **Pre-Loaded Demo Data**: Includes ready-to-test sample data (a Toyota RAV4 Hybrid and a Honda CB650R motorcycle) so you can explore charts and features immediately.

---

## 🚀 How to Run the Application

Because PitStop is built with clean vanilla HTML5, CSS3, and modern JavaScript:

1. **Directly in your Browser**:
   - Double-click `index.html` or drag and drop it into Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, or Safari.
   - Alternatively, open the file path:
     ```
     C:\Users\Sanjay\.gemini\antigravity\scratch\vehicle-logger\index.html
     ```

2. **No Installation or Server Required**:
   - Zero `npm install` needed.
   - Fully functional offline without an active internet connection.

---

## 📐 True Fuel Mileage Formula

The app implements the standard full-tank method:

$$\text{Fuel Mileage (km/L)} = \frac{\text{Odometer}_{\text{current}} - \text{Odometer}_{\text{previous full}}}{\sum \text{Fuel Volume}_{\text{intermediate partials}} + \text{Fuel Volume}_{\text{current}}}$$

- **L/100km**: $\frac{100}{\text{km/L}}$
- **MPG (US)**: $\frac{\text{Distance (miles)}}{\text{Fuel (US gallons)}}$

---

## 📁 File Structure

```
vehicle-logger/
├── index.html       # Single-page application markup & modals
├── styles.css       # Automotive dark & light cockpit design system
├── app.js           # Automotive logic, local persistence, SVG chart renderer
└── README.md        # Documentation and calculation reference
```
