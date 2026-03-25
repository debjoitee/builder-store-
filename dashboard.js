// dashboard.js — same Firebase logic, beautiful new chart UI
import { db, auth } from "./firebase.js";
import { collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Auth guard (unchanged logic) ─────────────────────────────────
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Access denied. Please login.");
    window.location.href = "login.html";
  } else {
    loadDashboard();
  }
});

// ── Logout ────────────────────────────────────────────────────────
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ── Load dashboard (unchanged logic, new UI) ─────────────────────
async function loadDashboard() {
  const snapshot = await getDocs(collection(db, "products"));

  let totalProducts = 0;
  let totalStock    = 0;
  let totalValue    = 0;
  let lowStock      = 0;
  const names  = [];
  const stocks = [];
  const values = [];

  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    totalProducts++;
    totalStock += Number(p.stock);
    totalValue += Number(p.price) * Number(p.stock);
    if (Number(p.stock) < 10) lowStock++;
    names.push(p.name);
    stocks.push(Number(p.stock));
    values.push(Number(p.price) * Number(p.stock));
  });

  // Update stat cards
  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("totalStock").textContent    = totalStock.toLocaleString();
  document.getElementById("totalValue").textContent    = totalValue.toLocaleString("en-IN");
  document.getElementById("lowStockCount").textContent = lowStock;

  // Render Chart.js bar chart with dark theme
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          label: "Stock (units)",
          data: stocks,
          backgroundColor: "#f97316cc",
          borderColor: "#f97316",
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Value (₹)",
          data: values,
          backgroundColor: "#fbbf2455",
          borderColor: "#fbbf24",
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          yAxisID: "y2",
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: { color: "#a89f96", font: { family: "Barlow", size: 13 } }
        },
        tooltip: {
          backgroundColor: "#1f1f1f",
          borderColor: "#2e2e2e",
          borderWidth: 1,
          titleColor: "#f5f0eb",
          bodyColor: "#a89f96",
          padding: 12,
        }
      },
      scales: {
        x: {
          ticks: { color: "#a89f96", font: { family: "Barlow", size: 12 } },
          grid:  { color: "#2e2e2e" }
        },
        y: {
          ticks: { color: "#a89f96", font: { family: "Barlow", size: 12 } },
          grid:  { color: "#2e2e2e" }
        },
        y2: {
          position: "right",
          ticks: { color: "#fbbf24", font: { family: "Barlow", size: 12 } },
          grid:  { drawOnChartArea: false }
        }
      }
    }
  });
}