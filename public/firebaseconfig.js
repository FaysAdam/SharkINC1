// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// ---- CONFIG ----
const firebaseConfig = {
  apiKey: "AIzaSyDF-r6KgEvyxHpNZsncys46AVPlCSQG5eo",
  authDomain: "sharkinc-f7423.firebaseapp.com",
  projectId: "sharkinc-f7423",
  storageBucket: "sharkinc-f7423.firebasestorage.app",
  messagingSenderId: "806350597789",
  appId: "1:806350597789:web:ba761fd7c2ac92cd792e74",
  measurementId: "G-X4G5PESRVS"
};

// ---- INITIALISATION ----
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ---- REGISTER ----
window.registerUser = async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !password) return alert("Veuillez remplir tous les champs !");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      username,
      email,
      createdAt: new Date().toISOString()
    });
    alert("Compte créé avec succès !");
    window.location.href = "Login.html";
  } catch (error) {
    alert(error.message);
  }
};

// ---- LOGIN ----
window.loginUser = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Veuillez remplir tous les champs !");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "Profile.html";
  } catch (error) {
    alert(error.message);
  }
};

// ---- PROFILE ----
window.loadProfile = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        document.getElementById("welcome").innerText = `Bienvenue, ${snap.data().username}`;
      }
    } else {
      window.location.href = "Login.html";
    }
  });
};

// ---- LOGOUT ----
window.logoutUser = async () => {
  await signOut(auth);
  window.location.href = "Login.html";
};
