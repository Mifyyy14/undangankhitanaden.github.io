// ===================== SHEETDB API CONFIGURATION =====================
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/2tgem3ggjbl8k';

// ===================== SAVE GUEST TO SHEETDB =====================
async function saveGuest(formData) {
    try {
        showLoadingIndicator();
        
        // Prepare data untuk SheetDB
        const sheetData = {
            data: {
                'Nama': formData.name,
                'Alamat': formData.address,
                'Status': formData.status,
                'Waktu Konfirmasi': new Date().toLocaleString('id-ID')
            }
        };

        // Check apakah tamu sudah terdaftar
        const existingGuests = await fetchAllGuests();
        const existingGuest = existingGuests.find(
            g => g['Nama'] && g['Nama'].toLowerCase() === formData.name.toLowerCase()
        );

        if (existingGuest) {
            // Update existing guest
            await updateGuestOnSheet(formData);
        } else {
            // Create new guest
            await createGuestOnSheet(sheetData);
        }

        hideLoadingIndicator();

        // Simpan juga ke local storage sebagai backup
        const allGuests = JSON.parse(localStorage.getItem('khitananGuests') || '[]');
        const localExistingIndex = allGuests.findIndex(
            g => g.name.toLowerCase() === formData.name.toLowerCase()
        );
        
        if (localExistingIndex !== -1) {
            allGuests[localExistingIndex] = formData;
        } else {
            allGuests.unshift(formData);
        }
        localStorage.setItem('khitananGuests', JSON.stringify(allGuests));

    } catch (error) {
        hideLoadingIndicator();
        console.error('Error saving guest:', error);
        showError('Gagal menyimpan data. Silakan coba lagi.');
    }
}

// ===================== CREATE GUEST ON SHEETDB =====================
async function createGuestOnSheet(data) {
    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Guest created successfully:', result);
        return result;
    } catch (error) {
        console.error('Error creating guest on SheetDB:', error);
        throw error;
    }
}

// ===================== UPDATE GUEST ON SHEETDB =====================
async function updateGuestOnSheet(formData) {
    try {
        const updateData = {
            data: {
                'Nama': formData.name,
                'Alamat': formData.address,
                'Status': formData.status,
                'Waktu Konfirmasi': new Date().toLocaleString('id-ID')
            }
        };

        // Encode nama untuk URL
        const encodedName = encodeURIComponent(formData.name);
        const response = await fetch(`${SHEETDB_API_URL}/search?Nama=${encodedName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const searchResult = await response.json();
        
        if (searchResult.data && searchResult.data.length > 0) {
            // Update the first matching record
            const updateResponse = await fetch(`${SHEETDB_API_URL}/Nama/${encodedName}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!updateResponse.ok) {
                throw new Error(`HTTP error! status: ${updateResponse.status}`);
            }

            const result = await updateResponse.json();
            console.log('Guest updated successfully:', result);
            return result;
        } else {
            // Jika tidak ditemukan, buat baru
            return await createGuestOnSheet(updateData);
        }
    } catch (error) {
        console.error('Error updating guest on SheetDB:', error);
        // Fallback: create as new if update fails
        try {
            return await createGuestOnSheet({
                data: {
                    'Nama': formData.name,
                    'Alamat': formData.address,
                    'Status': formData.status,
                    'Waktu Konfirmasi': new Date().toLocaleString('id-ID')
                }
            });
        } catch (fallbackError) {
            throw fallbackError;
        }
    }
}

// ===================== FETCH ALL GUESTS FROM SHEETDB =====================
async function fetchAllGuests() {
    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data from SheetDB:', data);
        
        // SheetDB returns data in different formats depending on the response
        if (Array.isArray(data)) {
            return data;
        }
        if (data && Array.isArray(data.data)) {
            return data.data;
        }
        if (data && data.response && Array.isArray(data.response)) {
            return data.response;
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching guests from SheetDB:', error);
        // Return local storage data as fallback
        const fallbackData = JSON.parse(localStorage.getItem('khitananGuests') || '[]');
        console.log('Using fallback local storage data:', fallbackData);
        return fallbackData;
    }
}

// ===================== LOAD WISHES =====================
async function loadWishes() {
    try {
        showLoadingIndicator();
        
        const guests = await fetchAllGuests();
        console.log('Loading guests:', guests);
        
        const container = document.getElementById('wishContainer');
        const stats = document.getElementById('guestStats');

        if (!guests || guests.length === 0) {
            container.innerHTML = '<div class="text-center text-sm" style="color: var(--text-primary); opacity: 0.5; padding: 1.5rem 0;"><i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>Belum ada yang mengkonfirmasi... Jadilah yang pertama!</div>';
            stats.classList.add('hidden');
            hideLoadingIndicator();
            return;
        }

        stats.classList.remove('hidden');

        let hadir = 0, tidakHadir = 0;
        
        guests.forEach(g => {
            if (g['Status'] === 'Akan Hadir') {
                hadir++;
            } else if (g['Status'] === 'Tidak Hadir') {
                tidakHadir++;
            }
        });

        document.getElementById('countHadir').innerText = hadir;
        document.getElementById('countTidakHadir').innerText = tidakHadir;

        // Sort guests: Akan Hadir first, then Tidak Hadir
        const sortedGuests = guests.sort((a, b) => {
            if (a['Status'] === 'Akan Hadir' && b['Status'] !== 'Akan Hadir') return -1;
            if (a['Status'] !== 'Akan Hadir' && b['Status'] === 'Akan Hadir') return 1;
            return 0;
        });

        container.innerHTML = sortedGuests.map((g, idx) => {
            let statusColor = 'rgba(16, 185, 129, 0.7)';
            let statusIcon = '✓';
            
            if (g['Status'] === 'Akan Hadir') {
                statusColor = 'rgba(16, 185, 129, 0.7)';
                statusIcon = '✓';
            } else if (g['Status'] === 'Tidak Hadir') {
                statusColor = 'rgba(239, 68, 68, 0.7)';
                statusIcon = '✕';
            }

            const nama = g['Nama'] ? String(g['Nama']).trim() : 'Tidak diketahui';
            const alamat = g['Alamat'] ? String(g['Alamat']).trim() : 'Tidak ada alamat';
            const status = g['Status'] ? String(g['Status']).trim() : 'Belum Dikonfirmasi';
            const waktu = g['Waktu Konfirmasi'] ? String(g['Waktu Konfirmasi']).trim() : 'Tidak ada waktu';

            return `
                <div class="wish-item" data-aos="fade-up" data-aos-delay="${Math.min(idx * 30, 200)}">
                    <div class="wish-name">
                        <i class="fas fa-user-circle" style="color: var(--gold-primary); opacity: 0.7; margin-right: 0.5rem;"></i>
                        ${escapeHtml(nama)}
                    </div>
                    <div class="wish-status" style="background: ${statusColor}; border: none; color: white;">
                        <i class="fas fa-circle-info" style="margin-right: 0.4rem;"></i>
                        ${status}
                    </div>
                    <div class="wish-text" style="font-style: normal; opacity: 0.8;">
                        <i class="fas fa-map-marker-alt" style="color: var(--gold-primary); margin-right: 0.5rem;"></i>
                        ${escapeHtml(alamat)}
                    </div>
                    <div class="wish-text" style="font-style: normal; opacity: 0.6; font-size: 0.8rem; margin-top: 0.5rem;">
                        <i class="fas fa-clock" style="color: var(--gold-primary); margin-right: 0.4rem;"></i>
                        ${waktu}
                    </div>
                </div>
            `;
        }).join('');
        
        hideLoadingIndicator();
        
        // Refresh AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    } catch (error) {
        hideLoadingIndicator();
        console.error('Error loading wishes:', error);
        const container = document.getElementById('wishContainer');
        container.innerHTML = '<div class="text-center text-sm" style="color: #ef4444; opacity: 0.8; padding: 1.5rem 0;"><i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>Gagal memuat data tamu. Silakan refresh halaman.</div>';
    }
}

// ===================== GET GUESTS DATA =====================
async function getGuestsData() {
    return await fetchAllGuests();
}

// ===================== CLEAR ALL GUESTS DATA =====================
async function clearGuestsData() {
    if (confirm('⚠️ Apakah Anda YAKIN ingin menghapus SEMUA data tamu? Tindakan ini tidak dapat dibatalkan!')) {
        try {
            showLoadingIndicator();
            
            // Clear SheetDB
            const guests = await fetchAllGuests();
            
            if (guests && guests.length > 0) {
                for (const guest of guests) {
                    try {
                        const encodedName = encodeURIComponent(guest['Nama']);
                        await fetch(`${SHEETDB_API_URL}/Nama/${encodedName}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                    } catch (deleteError) {
                        console.warn('Failed to delete single guest:', deleteError);
                    }
                }
            }
            
            // Clear local storage
            localStorage.removeItem('khitananGuests');
            
            hideLoadingIndicator();
            await loadWishes();
            showSuccessMessage('✓ Semua data tamu berhasil dihapus');
        } catch (error) {
            hideLoadingIndicator();
            console.error('Error clearing data:', error);
            showError('Gagal menghapus data.');
        }
    }
}

// ===================== EXPORT DATA TO CSV =====================
async function exportDataToCSV() {
    try {
        const guests = await fetchAllGuests();
        
        if (!guests || guests.length === 0) {
            showError('Tidak ada data untuk diexport');
            return;
        }

        // Prepare CSV header with BOM for Excel compatibility
        const BOM = '\uFEFF';
        const headers = ['Nama', 'Alamat', 'Status', 'Waktu Konfirmasi'];
        const csvContent = [
            headers.join(','),
            ...guests.map(g => [
                `"${String(g['Nama'] || '').replace(/"/g, '""')}"`,
                `"${String(g['Alamat'] || '').replace(/"/g, '""')}"`,
                String(g['Status'] || ''),
                String(g['Waktu Konfirmasi'] || '')
            ].join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `tamu-khitan-${new Date().toLocaleDateString('id-ID')}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccessMessage('✓ Data berhasil diexport ke CSV');
    } catch (error) {
        console.error('Error exporting data:', error);
        showError('Gagal mengexport data.');
    }
}

// ===================== REFRESH DATA MANUALLY =====================
async function refreshGuestData() {
    console.log('Refreshing guest data...');
    await loadWishes();
}

