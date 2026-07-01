function formatHourlyPrice(value) {
  return `Kr. ${Math.round(Number(value))},-`;
}

function formatMileagePrice(value) {
  const n = Number(value);
  const text = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
  return `Kr. ${text}`;
}

function applyPrices(data) {
  const hourly = document.getElementById("price-hourly");
  const mileage = document.getElementById("price-mileage");
  if (hourly) hourly.textContent = formatHourlyPrice(data.hourly);
  if (mileage) mileage.textContent = formatMileagePrice(data.mileage);

  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.content = `Priser på bogføring – kr. ${Math.round(data.hourly)} + moms pr. time.`;
  }
}

async function loadPrices() {
  try {
    const res = await fetch(`assets/data/prices.json?v=${Date.now()}`);
    if (!res.ok) throw new Error("fetch failed");
    applyPrices(await res.json());
  } catch {
    /* Beholder standardtekst i HTML ved fejl */
  }
}

document.addEventListener("DOMContentLoaded", loadPrices);
