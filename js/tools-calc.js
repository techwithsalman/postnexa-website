/**
 * PostNexa Tools — Calculators & Unit Converter Controller
 * Pure Client-Side Math & Precision Parsing
 */

(function () {
  'use strict';

  // ==========================================
  // PERCENTAGE CALCULATOR
  // ==========================================
  function initPercentageCalculator() {
    // Mode 1: X% of Y
    const m1X = document.getElementById('pctM1X');
    const m1Y = document.getElementById('pctM1Y');
    const m1Res = document.getElementById('pctM1Result');

    function calc1() {
      if (!m1X || !m1Y || !m1Res) return;
      const x = parseFloat(m1X.value);
      const y = parseFloat(m1Y.value);
      if (isNaN(x) || isNaN(y)) {
        m1Res.textContent = '—';
      } else {
        const val = (x / 100) * y;
        m1Res.textContent = Number.isInteger(val) ? val : parseFloat(val.toFixed(4));
      }
    }

    if (m1X && m1Y) {
      m1X.addEventListener('input', calc1);
      m1Y.addEventListener('input', calc1);
      calc1();
    }

    // Mode 2: X is what % of Y
    const m2X = document.getElementById('pctM2X');
    const m2Y = document.getElementById('pctM2Y');
    const m2Res = document.getElementById('pctM2Result');

    function calc2() {
      if (!m2X || !m2Y || !m2Res) return;
      const x = parseFloat(m2X.value);
      const y = parseFloat(m2Y.value);
      if (isNaN(x) || isNaN(y) || y === 0) {
        m2Res.textContent = '—';
      } else {
        const val = (x / y) * 100;
        m2Res.textContent = `${parseFloat(val.toFixed(2))}%`;
      }
    }

    if (m2X && m2Y) {
      m2X.addEventListener('input', calc2);
      m2Y.addEventListener('input', calc2);
      calc2();
    }

    // Mode 3: Percentage change from X to Y
    const m3X = document.getElementById('pctM3X');
    const m3Y = document.getElementById('pctM3Y');
    const m3Res = document.getElementById('pctM3Result');

    function calc3() {
      if (!m3X || !m3Y || !m3Res) return;
      const x = parseFloat(m3X.value);
      const y = parseFloat(m3Y.value);
      if (isNaN(x) || isNaN(y) || x === 0) {
        m3Res.textContent = '—';
      } else {
        const diff = y - x;
        const pct = (diff / x) * 100;
        const sign = pct >= 0 ? '+' : '';
        m3Res.textContent = `${sign}${parseFloat(pct.toFixed(2))}% (${pct >= 0 ? 'Increase' : 'Decrease'})`;
      }
    }

    if (m3X && m3Y) {
      m3X.addEventListener('input', calc3);
      m3Y.addEventListener('input', calc3);
      calc3();
    }
  }

  // ==========================================
  // AGE CALCULATOR
  // ==========================================
  function initAgeCalculator() {
    const birthInput = document.getElementById('ageBirthDate');
    const targetInput = document.getElementById('ageTargetDate');
    const mainAgeEl = document.getElementById('ageMainResult');
    const totalMonthsEl = document.getElementById('ageTotalMonths');
    const totalWeeksEl = document.getElementById('ageTotalWeeks');
    const totalDaysEl = document.getElementById('ageTotalDays');
    const totalHoursEl = document.getElementById('ageTotalHours');
    const nextBdayEl = document.getElementById('ageNextBday');

    if (!birthInput || !targetInput) return;

    // Default target date to today
    targetInput.value = new Date().toISOString().split('T')[0];

    function calculate() {
      const birth = new Date(birthInput.value);
      const target = new Date(targetInput.value);

      if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
        if (mainAgeEl) mainAgeEl.textContent = 'Please select a valid birth date.';
        return;
      }

      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffMs = target.getTime() - birth.getTime();
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = years * 12 + months;
      const totalHours = totalDays * 24;

      if (mainAgeEl) {
        mainAgeEl.textContent = `${years} years, ${months} months, ${days} days`;
      }
      if (totalMonthsEl) totalMonthsEl.textContent = totalMonths.toLocaleString();
      if (totalWeeksEl) totalWeeksEl.textContent = totalWeeks.toLocaleString();
      if (totalDaysEl) totalDaysEl.textContent = totalDays.toLocaleString();
      if (totalHoursEl) totalHoursEl.textContent = totalHours.toLocaleString();

      // Next birthday countdown
      let nextYear = target.getFullYear();
      let nextBday = new Date(nextYear, birth.getMonth(), birth.getDate());
      if (nextBday < target) {
        nextBday = new Date(nextYear + 1, birth.getMonth(), birth.getDate());
      }
      const nextDiffMs = nextBday.getTime() - target.getTime();
      const nextDays = Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));
      const nextM = Math.floor(nextDays / 30.4375);
      const nextD = Math.floor(nextDays % 30.4375);

      if (nextBdayEl) {
        nextBdayEl.textContent = `${nextM} months, ${nextD} days (${nextDays} total days)`;
      }
    }

    birthInput.addEventListener('input', calculate);
    targetInput.addEventListener('input', calculate);
    calculate();
  }

  // ==========================================
  // DISCOUNT CALCULATOR
  // ==========================================
  function initDiscountCalculator() {
    const priceInput = document.getElementById('discPrice');
    const pctInput = document.getElementById('discPercent');
    const taxInput = document.getElementById('discTax');
    const finalPriceEl = document.getElementById('discFinalPrice');
    const savedAmountEl = document.getElementById('discSavedAmount');
    const taxAmountEl = document.getElementById('discTaxAmount');

    if (!priceInput || !pctInput) return;

    function calculate() {
      const price = parseFloat(priceInput.value);
      const disc = parseFloat(pctInput.value);
      const tax = parseFloat(taxInput?.value || '0') || 0;

      if (isNaN(price) || isNaN(disc) || price < 0 || disc < 0) {
        if (finalPriceEl) finalPriceEl.textContent = '$0.00';
        if (savedAmountEl) savedAmountEl.textContent = '$0.00';
        if (taxAmountEl) taxAmountEl.textContent = '$0.00';
        return;
      }

      const saved = price * (disc / 100);
      const discounted = Math.max(0, price - saved);
      const taxVal = discounted * (tax / 100);
      const finalVal = discounted + taxVal;

      if (finalPriceEl) finalPriceEl.textContent = `$${finalVal.toFixed(2)}`;
      if (savedAmountEl) savedAmountEl.textContent = `$${saved.toFixed(2)}`;
      if (taxAmountEl) taxAmountEl.textContent = `$${taxVal.toFixed(2)}`;
    }

    priceInput.addEventListener('input', calculate);
    pctInput.addEventListener('input', calculate);
    if (taxInput) taxInput.addEventListener('input', calculate);
    calculate();
  }

  // ==========================================
  // UNIT CONVERTER
  // ==========================================
  function initUnitConverter() {
    const catSelect = document.getElementById('unitCategory');
    const fromSelect = document.getElementById('unitFrom');
    const toSelect = document.getElementById('unitTo');
    const valInput = document.getElementById('unitValue');
    const resultEl = document.getElementById('unitResult');
    const swapBtn = document.getElementById('unitSwapBtn');

    if (!catSelect || !fromSelect || !toSelect || !valInput) return;

    const UNIT_DATA = {
      length: {
        units: [
          { id: 'm', name: 'Meters (m)', factor: 1 },
          { id: 'km', name: 'Kilometers (km)', factor: 1000 },
          { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
          { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
          { id: 'mi', name: 'Miles (mi)', factor: 1609.344 },
          { id: 'yd', name: 'Yards (yd)', factor: 0.9144 },
          { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
          { id: 'in', name: 'Inches (in)', factor: 0.0254 },
        ],
      },
      weight: {
        units: [
          { id: 'kg', name: 'Kilograms (kg)', factor: 1 },
          { id: 'g', name: 'Grams (g)', factor: 0.001 },
          { id: 'mg', name: 'Milligrams (mg)', factor: 0.000001 },
          { id: 'lb', name: 'Pounds (lbs)', factor: 0.45359237 },
          { id: 'oz', name: 'Ounces (oz)', factor: 0.028349523125 },
          { id: 't', name: 'Metric Tons (t)', factor: 1000 },
        ],
      },
      temperature: {
        units: [
          { id: 'C', name: 'Celsius (°C)' },
          { id: 'F', name: 'Fahrenheit (°F)' },
          { id: 'K', name: 'Kelvin (K)' },
        ],
      },
      area: {
        units: [
          { id: 'sqm', name: 'Square Meters (m²)', factor: 1 },
          { id: 'sqkm', name: 'Square Kilometers (km²)', factor: 1000000 },
          { id: 'sqft', name: 'Square Feet (ft²)', factor: 0.09290304 },
          { id: 'acre', name: 'Acres', factor: 4046.8564224 },
          { id: 'ha', name: 'Hectares (ha)', factor: 10000 },
        ],
      },
      volume: {
        units: [
          { id: 'L', name: 'Liters (L)', factor: 1 },
          { id: 'mL', name: 'Milliliters (mL)', factor: 0.001 },
          { id: 'gal', name: 'Gallons US (gal)', factor: 3.785411784 },
          { id: 'cum', name: 'Cubic Meters (m³)', factor: 1000 },
        ],
      },
      data: {
        units: [
          { id: 'B', name: 'Bytes (B)', factor: 1 },
          { id: 'KB', name: 'Kilobytes (KB)', factor: 1024 },
          { id: 'MB', name: 'Megabytes (MB)', factor: 1024 * 1024 },
          { id: 'GB', name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
          { id: 'TB', name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
        ],
      },
    };

    function populateUnits() {
      const cat = catSelect.value;
      const data = UNIT_DATA[cat];
      if (!data) return;

      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';

      data.units.forEach((u, i) => {
        const opt1 = document.createElement('option');
        opt1.value = u.id;
        opt1.textContent = u.name;
        fromSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = u.id;
        opt2.textContent = u.name;
        if (i === 1) opt2.selected = true;
        toSelect.appendChild(opt2);
      });

      convert();
    }

    function convert() {
      const cat = catSelect.value;
      const val = parseFloat(valInput.value);
      if (isNaN(val)) {
        if (resultEl) resultEl.textContent = '—';
        return;
      }

      const fromId = fromSelect.value;
      const toId = toSelect.value;

      if (cat === 'temperature') {
        let celsius = val;
        if (fromId === 'F') celsius = ((val - 32) * 5) / 9;
        if (fromId === 'K') celsius = val - 273.15;

        let res = celsius;
        if (toId === 'F') res = (celsius * 9) / 5 + 32;
        if (toId === 'K') res = celsius + 273.15;

        if (resultEl) resultEl.textContent = `${parseFloat(res.toFixed(4))} ${toSelect.options[toSelect.selectedIndex].text}`;
        return;
      }

      const data = UNIT_DATA[cat];
      const fromObj = data.units.find((u) => u.id === fromId);
      const toObj = data.units.find((u) => u.id === toId);

      if (!fromObj || !toObj) return;

      const baseVal = val * fromObj.factor;
      const outVal = baseVal / toObj.factor;

      if (resultEl) {
        resultEl.textContent = `${parseFloat(outVal.toFixed(6))} ${toSelect.options[toSelect.selectedIndex].text}`;
      }
    }

    catSelect.addEventListener('change', populateUnits);
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);
    valInput.addEventListener('input', convert);

    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        convert();
      });
    }

    populateUnits();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPercentageCalculator();
    initAgeCalculator();
    initDiscountCalculator();
    initUnitConverter();
  });
})();
