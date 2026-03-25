// login.js — same Firebase Auth logic
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = async function () {
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errEl    = document.getElementById("authErr");

  errEl.style.display = "none";

  if (!email || !password) {
    errEl.textContent = "Please fill in both fields.";
    errEl.style.display = "block";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (error) {
    errEl.textContent = "Invalid email or password. Please try again.";
    errEl.style.display = "block";
  }
};

// Allow Enter key to submit
document.addEventListener("keydown", e => {
  if (e.key === "Enter") window.login();
});
