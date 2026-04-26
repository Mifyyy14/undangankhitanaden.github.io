# Walimatul Khitan Diendra Maulana Syakir

Undangan digital khitanan yang interaktif dan responsif untuk acara khitanan putra kami Diendra Maulana Syakir.

## 📁 Struktur Project
walimatul-khitan/ ├── index.html # File HTML utama ├── assets/ │ ├── css/ │ │ ├── style.css # CSS utama (styling) │ │ └── animations.css # CSS animasi │ ├── js/ │ │ ├── main.js # JavaScript utama (core functions) │ │ ├── countdown.js # Countdown timer logic │ │ ├── form.js # Form validation & submission │ │ └── storage.js # Local storage management │ └── audio/ │ └── islamic-background.mp3 # Background music ├── README.md # Dokumentasi project └── .gitignore # File git ignore


## 🚀 Fitur

- ✅ Responsive design (mobile & desktop)
- ✅ Countdown timer hingga acara
- ✅ Form konfirmasi kehadiran
- ✅ Daftar tamu dengan statistik
- ✅ Nomor rekening untuk kontribusi
- ✅ Background music
- ✅ Animasi AOS (Animate On Scroll)
- ✅ Local storage untuk data persistence
- ✅ Copy to clipboard untuk nomor rekening
- ✅ Error handling & validation

## 💻 Cara Menggunakan

### 1. Setup Project

```bash
# Clone repository
git clone <repository-url>

# Masuk ke folder project
cd walimatul-khitan

# Buka index.html di browser (atau gunakan live server)

2. Struktur File
index.html: File HTML utama yang menampilkan struktur halaman
assets/css/style.css: Styling utama untuk desain keseluruhan
assets/css/animations.css: Semua animasi CSS
assets/js/main.js: Fungsi global dan core logic
assets/js/countdown.js: Timer countdown hingga acara
assets/js/form.js: Validasi dan submission form
assets/js/storage.js: Manajemen local storage dan data
3. Customize Data
Edit data berikut di index.html:

Nama Acara & Anak:

<h1>Diendra Maulana Syakir</h1>

Tanggal Acara (Countdown): Ubah di assets/js/countdown.js:

const targetDate = new Date("May 7, 2026 09:00:00").getTime();

Nomor Rekening: Edit di index.html section "Nomor Rekening"

Informasi Kontak: Edit di footer section

4. Audio Background
Ganti file assets/audio/islamic-background.mp3 dengan audio pilihan Anda.

📱 Responsivitas
Project ini fully responsive untuk:

Mobile phones (320px - 480px)
Tablets (481px - 768px)
Desktop (769px+)
🎨 Kustomisasi Warna
Edit CSS variables di assets/css/style.css:
:root {
    --gold-primary: #D4AF37;
    --gold-light: #E8C547;
    --black-primary: #0F0F0F;
    --text-primary: #F5E6D3;
    /* ... lebih banyak variabel */
}

🔌 Dependencies
Font Awesome - Icon library
AOS (Animate On Scroll) - Scroll animation
Google Fonts - Typography
Semua library di-load via CDN, tidak perlu install.

💾 Local Storage
Data disimpan di local storage browser dengan key:

khitananGuests - Daftar tamu yang sudah mengkonfirmasi
Clear data:
// Di browser console
localStorage.removeItem('khitananGuests');

🛠️ Development
Edit CSS
Modifikasi file di assets/css/ sesuai kebutuhan.

Edit JavaScript
Modifikasi file di assets/js/ untuk logika custom.

Add New Section
Tambahkan <section> baru di index.html dan style di CSS.

📊 Browser Support
Chrome (Latest)
Firefox (Latest)
Safari (Latest)
Edge (Latest)
Mobile browsers
📄 License
Personal use only. Developed with ❤️

👨‍💻 Author
Dibuat untuk momen istimewa Walimatul Khitan Diendra Maulana Syakir.

Semoga acara ini diberkahi dan berjalan lancar 🤲