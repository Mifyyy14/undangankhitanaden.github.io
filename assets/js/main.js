// ===================== INITIALIZE AOS =====================
AOS.init({
    duration: 800,
    once: false,
    mirror: true,
    offset: 50
});

// ===================== GLOBAL VARIABLES =====================
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');
const controls = document.getElementById('controls');

// ===================== PAGE LOAD =====================
window.addEventListener('load', () => {
    loadWishes();
});

// ===================== FORM SUBMISSION =====================
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const status = document.querySelector('input[name="status"]:checked')?.value;

        if (!name || name.length < 3) {
            showError('Nama harus minimal 3 karakter');
            return;
        }
        if (!address || address.length < 5) {
            showError('Alamat harus minimal 5 karakter');
            return;
        }
        if (!status) {
            showError('Pilih status kehadiran');
            return;
        }

        const formData = {
            name: name,
            address: address,
            status: status,
            timestamp: new Date().toISOString()
        };

        try {
            await saveGuest(formData);
            showSuccessMessage('Konfirmasi Anda telah berhasil dikirim');
            rsvpForm.reset();
            await loadWishes();
        } catch (error) {
            showError('Gagal mengirim konfirmasi. Silakan coba lagi.');
        }
    });
}

// ===================== OPEN INVITATION =====================
function bukaUndangan() {
    bgMusic.play().catch(() => {});
    overlay.classList.add('hidden');
    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 50);
    controls.classList.remove('hidden');
    
    // Scroll to top
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    AOS.refresh();
}

// ===================== TOGGLE MUSIC =====================
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicIcon.className = 'fas fa-volume-up';
    } else {
        bgMusic.pause();
        musicIcon.className = 'fas fa-volume-mute';
    }
}

// ===================== TOGGLE FULLSCREEN =====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        document.getElementById('fsIcon').className = 'fas fa-compress';
    } else {
        document.exitFullscreen();
        document.getElementById('fsIcon').className = 'fas fa-expand';
    }
}

// ===================== SUCCESS MESSAGE =====================
function showSuccessMessage(message = 'Konfirmasi Anda telah berhasil dikirim') {
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.innerHTML = `
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <h3>Terima Kasih! 🎉</h3>
        <p>${message}</p>
    `;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
    }, 3000);
}

// ===================== ERROR MESSAGE =====================
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-toast';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
    document.body.appendChild(errorEl);
    setTimeout(() => {
        errorEl.style.opacity = '0';
        setTimeout(() => errorEl.remove(), 500);
    }, 3000);
}

// ===================== COPY TO CLIPBOARD =====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyMessage();
    }).catch(() => {
        showError('Gagal menyalin nomor rekening');
    });
}

function showCopyMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <h3>Berhasil Disalin!</h3>
        <p>Nomor rekening telah disalin ke clipboard</p>
    `;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
    }, 2500);
}

// ===================== ESCAPE HTML =====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================== LOADING INDICATOR =====================
function showLoadingIndicator() {
    const loading = document.createElement('div');
    loading.id = 'loadingIndicator';
    loading.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(212, 175, 55, 1);
        color: #0F0F0F;
        padding: 2rem 3rem;
        border-radius: 1rem;
        z-index: 1002;
        text-align: center;
        font-weight: bold;
    `;
    loading.innerHTML = `
        <div style="width: 2rem; height: 2rem; border: 3px solid #0F0F0F; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        Memproses data...
    `;
    document.body.appendChild(loading);
}

function hideLoadingIndicator() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}