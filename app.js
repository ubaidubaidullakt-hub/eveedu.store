// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAO_dx7l9kzOkNTJ5dBnJV8f36RrLo7LLw",
  authDomain: "eveedustore.firebaseapp.com",
  projectId: "eveedustore",
  storageBucket: "eveedustore.firebasestorage.app",
  messagingSenderId: "540392202254",
  appId: "1:540392202254:web:91d5e73fcfd5f20f7b5c5f"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Admin email
const ADMIN_EMAIL = "ahamedmishab@gmail.com";

// Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      if(user.email === ADMIN_EMAIL){
        window.location = "admin.html";
      } else {
        alert("Seller login successful. Waiting for admin verification.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Login failed!");
    });
}

// Buyer Guest Mode WhatsApp
function buyerWhatsApp() {
  let buyerName = localStorage.getItem("buyerName");
  if(!buyerName){
    buyerName = prompt("Enter your name");
    localStorage.setItem("buyerName", buyerName);
  }
  const waNumber = "918075855348"; // Your WhatsApp number with country code
  const message = `Hi E Veedu Store, My name is ${buyerName}. I want to contact for products/services.`;
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  window.open(url);
}

// Admin dashboard - add seller
if(document.getElementById("sellerForm")){
  const form = document.getElementById("sellerForm");
  const sellersList = document.getElementById("sellersList");

  // Load existing sellers
  db.collection("sellers").onSnapshot(snapshot => {
    sellersList.innerHTML = "";
    snapshot.forEach(doc => {
      const s = doc.data();
      const li = document.createElement("li");
      li.textContent = `${s.brand} (${s.category}) - ${s.district} - ${s.phone} ${s.verified ? "✅ Verified" : ""}`;
      sellersList.appendChild(li);
    });
  });

  // Add new seller
  form.addEventListener("submit", e => {
    e.preventDefault();
    const brand = document.getElementById("brand").value;
    const owner = document.getElementById("owner").value;
    const category = document.getElementById("category").value;
    const district = document.getElementById("district").value;
    const phone = document.getElementById("phone").value;
    const verified = document.getElementById("verified").checked;

    db.collection("sellers").add({
      brand, owner, category, district, phone, verified
    })
    .then(() => {
      alert("Seller added successfully!");
      form.reset();
    })
    .catch(err => console.error(err));
  });
}