const GITHUB = {
  owner: "Nordictester",
  repo: "jensens-bogforing",
  branch: "main",
  path: "assets/data/prices.json",
};

const TOKEN_KEY = "jbbj_github_pat";
const SESSION_KEY = "jbbj_admin_ok";

// Skift kode: erstat tallene (tegnkoder) — standard: Sondermarken23
const ADMIN_CODE_PARTS = [83, 111, 110, 100, 101, 114, 109, 97, 114, 107, 101, 110, 50, 51];

function getAdminCode() {
  return String.fromCharCode(...ADMIN_CODE_PARTS);
}

function $(id) {
  return document.getElementById(id);
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function showAdmin() {
  $("login-screen").hidden = true;
  $("admin-content").hidden = false;
}

function setStatus(message, type) {
  const el = $("admin-status");
  if (!el) return;
  el.textContent = message;
  el.className = `admin-status ${type || ""}`;
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function toBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function fetchPricesFile(token) {
  const url = `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${GITHUB.path}?ref=${GITHUB.branch}`;
  const res = await fetch(url, { headers: githubHeaders(token) });
  if (!res.ok) throw new Error("Kunne ikke hente priser fra GitHub.");
  const data = await res.json();
  const json = JSON.parse(atob(data.content.replace(/\n/g, "")));
  return { json, sha: data.sha };
}

async function savePricesFile(token, prices, sha) {
  const body = JSON.stringify(prices, null, 2) + "\n";
  const url = `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${GITHUB.path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Opdater priser via admin",
      content: toBase64Utf8(body),
      sha,
      branch: GITHUB.branch,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Kunne ikke gemme priser på GitHub.");
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function loadFormPrices() {
  const token = getToken();
  if (!token) return;

  try {
    const { json } = await fetchPricesFile(token);
    $("price-hourly-input").value = json.hourly;
    $("price-mileage-input").value = json.mileage;
    setStatus("Priser hentet.", "ok");
  } catch (err) {
    setStatus(err.message, "error");
  }
}

async function handleSaveToken(e) {
  e.preventDefault();
  const token = $("github-token").value.trim();
  if (!token) {
    setStatus("Indsæt en GitHub-nøgle først.", "error");
    return;
  }
  saveToken(token);
  setStatus("Nøgle gemt i denne browser.", "ok");
  await loadFormPrices();
}

async function handleSavePrices(e) {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    setStatus("Gem en GitHub-nøgle først (se hjælp nedenfor).", "error");
    return;
  }

  const hourly = Number($("price-hourly-input").value);
  const mileage = Number($("price-mileage-input").value.replace(",", "."));
  if (!Number.isFinite(hourly) || hourly <= 0 || !Number.isFinite(mileage) || mileage <= 0) {
    setStatus("Udfyld gyldige priser.", "error");
    return;
  }

  setStatus("Gemmer …", "");
  try {
    const { sha } = await fetchPricesFile(token);
    await savePricesFile(token, { hourly, mileage }, sha);
    setStatus("Priser gemt. Siden opdateres om 1–2 minutter på nettet.", "ok");
  } catch (err) {
    setStatus(err.message, "error");
  }
}

function handleForgetToken() {
  saveToken("");
  $("github-token").value = "";
  setStatus("Nøgle slettet fra denne browser.", "ok");
}

function handleLogin(e) {
  e.preventDefault();
  const code = $("admin-code").value.trim();
  const error = $("login-error");

  if (code === getAdminCode()) {
    sessionStorage.setItem(SESSION_KEY, "1");
    error.textContent = "";
    showAdmin();
    ensureAdminReady();
    return;
  }

  error.textContent = "Forkert kode. Prøv igen.";
  $("admin-code").value = "";
  $("admin-code").focus();
}

function initAdmin() {
  const saved = getToken();
  if (saved) $("github-token").placeholder = "Nøgle er gemt — indsæt ny for at skifte";
  if (saved) loadFormPrices();

  $("token-form").addEventListener("submit", handleSaveToken);
  $("prices-form").addEventListener("submit", handleSavePrices);
  $("forget-token").addEventListener("click", handleForgetToken);
}

let adminReady = false;

function ensureAdminReady() {
  if (adminReady) return;
  adminReady = true;
  initAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
  $("login-form").addEventListener("submit", handleLogin);

  if (isLoggedIn()) {
    showAdmin();
    ensureAdminReady();
    return;
  }

  $("admin-code").focus();
});
