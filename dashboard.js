import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadDashboard() {

    const snapshot = await getDocs(collection(db, "products"));

    let totalProducts = 0;
    let totalStock = 0;
    let totalValue = 0;

    let names = [];
    let stocks = [];

    snapshot.forEach((doc) => {
        const p = doc.data();

        totalProducts++;
        totalStock += p.stock;
        totalValue += p.price * p.stock;

        names.push(p.name);
        stocks.push(p.stock);
    });

    document.getElementById("totalProducts").innerText = totalProducts;
    document.getElementById("totalStock").innerText = totalStock;
    document.getElementById("totalValue").innerText = totalValue;

    // 📊 Chart
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Stock',
                data: stocks
            }]
        }
    });
}

loadDashboard();