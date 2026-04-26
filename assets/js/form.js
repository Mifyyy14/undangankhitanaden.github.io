// ===================== GLOBAL FORM VARIABLES =====================
const rsvpForm = document.getElementById('rsvpForm');

// ===================== FORM VALIDATION =====================
function validateName(name) {
    return name && name.length >= 3;
}

// ===================== FORM SUBMISSION =====================
rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const status = document.querySelector('input[name="status"]:checked')?.value;

    if(!validateName(name)) {
        showError('Nama harus minimal 3 karakter');
        return;
    }

    if(!address || address.length < 5) {
        showError('Alamat harus minimal 5 karakter');
        return;
    }

    if(!status) {
        showError('Pilih status kehadiran');
        return;
    }

    const formData = {
        name: name,
        address: address,
        status: status,
        timestamp: new Date().toISOString()
    };

    // Save dengan async
    await saveGuest(formData);
    showSuccessMessage();
    rsvpForm.reset();
    await loadWishes();
});