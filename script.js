// --- CONFIG FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDKxcbRgZTSHrf_lw8tJgEJKJ6c1xXLh04",
  authDomain: "login-f051d.firebaseapp.com",
  databaseURL: "https://login-f051d-default-rtdb.firebaseio.com",
  projectId: "login-f051d",
  storageBucket: "login-f051d.firebasestorage.app",
  messagingSenderId: "492117934029",
  appId: "1:492117934029:web:4e13f5cf1efa57b0d34e84"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- NAVIGASI HAMBURGER ---
const hamburger = document.getElementById("hamburger");
const navMobile = document.getElementById("navMobile");
const closeBtn = document.getElementById("closeBtn");

hamburger.onclick = () => navMobile.classList.add("active");
closeBtn.onclick = () => navMobile.classList.remove("active");

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.onclick = () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    navMobile.classList.remove("active");
  };
});

// --- EFEK TYPING (HERO SECTION) ---
const textElement = document.getElementById("typing-text");
const texts = ["Front-End Developer", "Network Engineer"];
let i = 0, j = 0, deleting = false;

function type() {
  const current = texts[i];
  if (!deleting) j++; else j--;
  textElement.textContent = current.substring(0, j);
  let speed = deleting ? 90 : 160;
  if (!deleting && j === current.length) { 
    speed = 1500; 
    deleting = true; 
  }
  if (deleting && j === 0) { 
    deleting = false; 
    i = (i + 1) % texts.length; 
    speed = 700; 
  }
  setTimeout(type, speed);
}
type();

// --- AMBIL DATA SKILLS DARI FIREBASE ---
database.ref('skills').on('value', (snapshot) => {
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = "";
  
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      skillsList.innerHTML += `
        <div class="skill-item">
          <img src="${data.imageUrl}" alt="${data.title}">
          <span>${data.title}</span>
        </div>
      `;
    });
  } else {
    skillsList.innerHTML = "<p style='color: #888;'>No Skills added yet.</p>";
  }
});

// --- AMBIL DATA PROJECTS DARI FIREBASE ---
database.ref('projects').on('value', (snapshot) => {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = "";
  
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      projectsList.innerHTML += `
        <div class="skill-item">
          <img src="${data.imageUrl}" alt="${data.title}" style="border-radius: 10px; width: 100%; height: 120px; object-fit: cover;">
          <span>${data.title}</span>
        </div>
      `;
    });
  } else {
    projectsList.innerHTML = "<p style='color: #888;'>Coming Soon...</p>";
  }
});

// --- FUNGSI KIRIM WHATSAPP ---
function sendToWA() {
  const name = document.getElementById('wa_name').value;
  const email = document.getElementById('wa_email').value;
  const message = document.getElementById('wa_message').value;

  if (!name || !email || !message) { 
    alert("Harap isi semua kolom!"); 
    return; 
  }

  const phoneNumber = "6282284838714";
  const fullMessage = `nama: ${name}%0AGmail: ${email}%0Apesan: ${message}`;
  window.open(`https://wa.me/${phoneNumber}?text=${fullMessage}`, '_blank').focus();
}

// --- FUNGSI POST COMMENT KE FIREBASE ---
function postComment() {
  const name = document.getElementById('comment_name').value;
  const message = document.getElementById('comment_message').value;

  if (!name || !message) {
    alert("Harap isi Nama dan Pesan!");
    return;
  }

  // Simpan ke Realtime Database
  const newCommentRef = database.ref('comments').push();
  newCommentRef.set({
    name: name,
    message: message,
    timestamp: Date.now()
  }).then(() => {
    alert("Komentar terkirim!");
    document.getElementById('comment_name').value = "";
    document.getElementById('comment_message').value = "";
  }).catch((error) => {
    alert("Gagal mengirim: " + error.message);
  });
}
