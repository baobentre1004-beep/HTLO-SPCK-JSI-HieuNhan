// products.js
const firebaseConfig = {
  apiKey: "AIzaSyBhNpTgIBNv33aGn4Pi_3qoOAwzzG_6vn4",
  authDomain: "thecoffeeshop-1c9da.firebaseapp.com",
  projectId: "thecoffeeshop-1c9da",
  storageBucket: "thecoffeeshop-1c9da.firebasestorage.app",
  messagingSenderId: "578380271096",
  appId: "1:578380271096:web:04ecd4926d88b9cb711a0d",
  measurementId: "G-0R6WNNLCD9"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

const db = firebase.firestore();
const productsCol = db.collection("products");

// Khởi tạo sẵn nếu cơ sở dữ liệu trống
async function initProducts() {
  const snapshot = await productsCol.limit(1).get();
  if (snapshot.empty) {
    const list = [
      { id: "sp1", name: "Bàn phím cơ", category: "keyboard", price: 500000, desc: "Phím bấm nhẹ và êm tay.", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800" },
      { id: "sp2", name: "Chuột máy tính", category: "mouse", price: 350000, desc: "Chuột vừa lòng bàn tay, di chuyển êm.", img: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800" },
      { id: "sp3", name: "Tai nghe chụp tai", category: "headphone", price: 700000, desc: "Đệm tai mềm mại, nghe rõ ràng.", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800" }
    ];
    for (const item of list) {
      const { id, ...data } = item;
      await productsCol.doc(id).set(data);
    }
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) {
    const total = getCart().reduce((sum, i) => sum + i.quantity, 0);
    el.textContent = total;
  }
}

async function addToCart(docId) {
  const doc = await productsCol.doc(docId).get();
  if (!doc.exists) return;

  const cart = getCart();
  const found = cart.find(i => i.id === docId);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ id: docId, ...doc.data(), quantity: 1 });
  }
  saveCart(cart);
  alert("Đã thêm vào giỏ hàng");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initProducts();
});