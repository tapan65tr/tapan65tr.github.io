/* Ultimate QR Code Generator Script
   Designed for Accessibility and Power
   Updated for Tapan: Added UPI, SMS, vCard, Event, Geo, Crypto
*/

// --- 1. EXTENSIVE COUNTRY DATABASE (Name & Hidden Code) ---
const countryList = [
    { name: "Afghanistan", code: "93" },
    { name: "Albania", code: "355" },
    { name: "Algeria", code: "213" },
    { name: "Argentina", code: "54" },
    { name: "Australia", code: "61" },
    { name: "Austria", code: "43" },
    { name: "Bahrain", code: "973" },
    { name: "Bangladesh", code: "880" },
    { name: "Belgium", code: "32" },
    { name: "Bhutan", code: "975" },
    { name: "Brazil", code: "55" },
    { name: "Canada", code: "1" },
    { name: "China", code: "86" },
    { name: "Colombia", code: "57" },
    { name: "Denmark", code: "45" },
    { name: "Egypt", code: "20" },
    { name: "Finland", code: "358" },
    { name: "France", code: "33" },
    { name: "Germany", code: "49" },
    { name: "Greece", code: "30" },
    { name: "Hong Kong", code: "852" },
    { name: "India", code: "91" },
    { name: "Indonesia", code: "62" },
    { name: "Iran", code: "98" },
    { name: "Iraq", code: "964" },
    { name: "Ireland", code: "353" },
    { name: "Israel", code: "972" },
    { name: "Italy", code: "39" },
    { name: "Japan", code: "81" },
    { name: "Kenya", code: "254" },
    { name: "Kuwait", code: "965" },
    { name: "Malaysia", code: "60" },
    { name: "Maldives", code: "960" },
    { name: "Mexico", code: "52" },
    { name: "Myanmar", code: "95" },
    { name: "Nepal", code: "977" },
    { name: "Netherlands", code: "31" },
    { name: "New Zealand", code: "64" },
    { name: "Nigeria", code: "234" },
    { name: "Norway", code: "47" },
    { name: "Oman", code: "968" },
    { name: "Pakistan", code: "92" },
    { name: "Philippines", code: "63" },
    { name: "Poland", code: "48" },
    { name: "Portugal", code: "351" },
    { name: "Qatar", code: "974" },
    { name: "Russia", code: "7" },
    { name: "Saudi Arabia", code: "966" },
    { name: "Singapore", code: "65" },
    { name: "South Africa", code: "27" },
    { name: "South Korea", code: "82" },
    { name: "Spain", code: "34" },
    { name: "Sri Lanka", code: "94" },
    { name: "Sweden", code: "46" },
    { name: "Switzerland", code: "41" },
    { name: "Thailand", code: "66" },
    { name: "Turkey", code: "90" },
    { name: "Ukraine", code: "380" },
    { name: "United Arab Emirates", code: "971" },
    { name: "United Kingdom", code: "44" },
    { name: "United States", code: "1" },
    { name: "Vietnam", code: "84" },
    { name: "Zimbabwe", code: "263" }
];

// --- 2. DOM ELEMENTS ---
const qrTypeSelector = document.getElementById('qrType');
const dynamicInputsDiv = document.getElementById('dynamicInputs');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.getElementById('qrcode');
const colorDarkSelect = document.getElementById('colorDark');
const colorLightSelect = document.getElementById('colorLight');
const sizeSelect = document.getElementById('qrSize');

// --- 3. HELPER: GENERATE COUNTRY OPTIONS (Name Only) ---
function getCountryOptionsHTML() {
    let options = '';
    countryList.sort((a, b) => a.name.localeCompare(b.name));
    
    countryList.forEach(c => {
        const isSelected = c.name === "India" ? "selected" : "";
        options += `<option value="${c.code}" ${isSelected}>${c.name}</option>`;
    });
    return options;
}

// --- 4. INPUT TEMPLATES ---
const inputConfig = {
    // --- EXISTING TYPES (UNCHANGED) ---
    text: `
        <div class="form-group">
            <label for="inpText">Enter Plain Text:</label>
            <textarea id="inpText" placeholder="Write anything here..." required></textarea>
        </div>`,
    
    url: `
        <div class="form-group">
            <label for="inpUrl">Website URL (e.g., https://google.com):</label>
            <input type="url" id="inpUrl" placeholder="https://example.com" required>
        </div>`,
    
    whatsapp: `
        <div class="form-group">
            <label for="inpCountry">Select Country:</label>
            <select id="inpCountry">${getCountryOptionsHTML()}</select>
        </div>
        <div class="form-group">
            <label for="inpPhone">Mobile Number (Without Code):</label>
            <input type="tel" id="inpPhone" placeholder="Example: 9876543210" pattern="[0-9]{5,15}" required>
        </div>
        <div class="form-group">
            <label for="inpWaMsg">Message (Optional):</label>
            <textarea id="inpWaMsg" placeholder="Hi..."></textarea>
        </div>`,

    phone: `
        <div class="form-group">
            <label for="inpCountry">Select Country:</label>
            <select id="inpCountry">${getCountryOptionsHTML()}</select>
        </div>
        <div class="form-group">
            <label for="inpPhone">Phone Number (Without Code):</label>
            <input type="tel" id="inpPhone" placeholder="Example: 9876543210" pattern="[0-9]{5,15}" required>
        </div>`,

    email: `
        <div class="form-group">
            <label for="inpEmail">Email Address:</label>
            <input type="email" id="inpEmail" placeholder="user@example.com" required>
        </div>
        <div class="form-group">
            <label for="inpSubject">Subject:</label>
            <input type="text" id="inpSubject" placeholder="Inquiry">
        </div>
        <div class="form-group">
            <label for="inpBody">Email Body:</label>
            <textarea id="inpBody" placeholder="Type your email content..."></textarea>
        </div>`,

    wifi: `
        <div class="form-group">
            <label for="inpSsid">Network Name (SSID):</label>
            <input type="text" id="inpSsid" required>
        </div>
        <div class="form-group">
            <label for="inpPass">Password:</label>
            <input type="text" id="inpPass">
        </div>
        <div class="form-group">
            <label for="inpCrypt">Security Type:</label>
            <select id="inpCrypt">
                <option value="WPA">WPA/WPA2 (Standard)</option>
                <option value="SAE">WPA3 (Newest)</option>
                <option value="WEP">WEP (Old)</option>
                <option value="nopass">Open (No Password)</option>
                <option value="WPA2-EAP">WPA2 Enterprise</option>
            </select>
        </div>`,

    // --- NEW TYPES START HERE ---
    
    // 1. UPI Payment (India)
    upi: `
        <div class="form-group">
            <label for="inpUpiId">UPI ID (VPA):</label>
            <input type="text" id="inpUpiId" placeholder="example@upi" required>
        </div>
        <div class="form-group">
            <label for="inpUpiName">Payee Name:</label>
            <input type="text" id="inpUpiName" placeholder="Merchant or Person Name" required>
        </div>
        <div class="form-group">
            <label for="inpUpiAmount">Amount (Optional):</label>
            <input type="number" id="inpUpiAmount" placeholder="0.00" step="0.01">
        </div>
        <div class="form-group">
            <label for="inpUpiNote">Note (Optional):</label>
            <input type="text" id="inpUpiNote" placeholder="Payment for...">
        </div>`,

    // 2. SMS Message
    sms: `
        <div class="form-group">
            <label for="inpPhone">Phone Number:</label>
            <input type="tel" id="inpPhone" placeholder="+919876543210" required>
        </div>
        <div class="form-group">
            <label for="inpSmsBody">Message:</label>
            <textarea id="inpSmsBody" placeholder="Type your SMS..."></textarea>
        </div>`,

    // 3. VCard (Contact)
    vcard: `
        <div class="form-group">
            <label for="inpVcName">Full Name:</label>
            <input type="text" id="inpVcName" placeholder="John Doe" required>
        </div>
        <div class="form-group">
            <label for="inpVcPhone">Mobile Number:</label>
            <input type="tel" id="inpVcPhone" placeholder="+91..." required>
        </div>
        <div class="form-group">
            <label for="inpVcEmail">Email:</label>
            <input type="email" id="inpVcEmail" placeholder="john@example.com">
        </div>
        <div class="form-group">
            <label for="inpVcOrg">Company/Org (Optional):</label>
            <input type="text" id="inpVcOrg">
        </div>`,

    // 4. Calendar Event
    event: `
        <div class="form-group">
            <label for="inpEvTitle">Event Title:</label>
            <input type="text" id="inpEvTitle" placeholder="Meeting..." required>
        </div>
        <div class="form-group">
            <label for="inpEvStart">Start Time:</label>
            <input type="datetime-local" id="inpEvStart" required>
        </div>
        <div class="form-group">
            <label for="inpEvEnd">End Time:</label>
            <input type="datetime-local" id="inpEvEnd" required>
        </div>
        <div class="form-group">
            <label for="inpEvLoc">Location (Optional):</label>
            <input type="text" id="inpEvLoc" placeholder="Office, Home...">
        </div>`,

    // 5. Geo Location
    geo: `
        <div class="form-group">
            <label for="inpLat">Latitude:</label>
            <input type="number" id="inpLat" step="any" placeholder="22.5726" required>
        </div>
        <div class="form-group">
            <label for="inpLon">Longitude:</label>
            <input type="number" id="inpLon" step="any" placeholder="88.3639" required>
        </div>
        <span style="font-size: 0.9em; color: #555;">Tip: You can get these from Google Maps.</span>`,

    // 6. Cryptocurrency
    crypto: `
        <div class="form-group">
            <label for="inpCryType">Currency:</label>
            <select id="inpCryType">
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="bitcoincash">Bitcoin Cash (BCH)</option>
                <option value="litecoin">Litecoin (LTC)</option>
            </select>
        </div>
        <div class="form-group">
            <label for="inpCryAddr">Wallet Address:</label>
            <input type="text" id="inpCryAddr" required>
        </div>
        <div class="form-group">
            <label for="inpCryAm">Amount (Optional):</label>
            <input type="number" id="inpCryAm" step="any" placeholder="0.001">
        </div>`
};

// --- 5. UPDATE INPUTS LOGIC ---
function updateInputs() {
    const type = qrTypeSelector.value;
    dynamicInputsDiv.innerHTML = inputConfig[type] || '';
    
    downloadBtn.style.display = 'none';

    // Access Key Shortcut for first input
    const firstInput = dynamicInputsDiv.querySelector('input, textarea, select');
    if(firstInput) firstInput.setAttribute('accesskey', 'i');
}

// --- 6. VALIDATION & GENERATION ---
function generateQR() {
    const type = qrTypeSelector.value;
    let finalData = "";

    // Step 1: Validate Inputs
    const inputs = dynamicInputsDiv.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return; 
        }
    }

    // Step 2: Extract Data
    try {
        // --- EXISTING LOGIC ---
        if (type === 'text') {
            finalData = document.getElementById('inpText').value;
        }
        else if (type === 'url') {
            let url = document.getElementById('inpUrl').value;
            if(!url.startsWith('http')) url = 'https://' + url;
            finalData = url;
        }
        else if (type === 'whatsapp') {
            const countryCode = document.getElementById('inpCountry').value;
            const phone = document.getElementById('inpPhone').value.trim();
            const msg = document.getElementById('inpWaMsg').value;
            const fullPhone = countryCode + phone;
            finalData = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
        }
        else if (type === 'phone') {
            const countryCode = document.getElementById('inpCountry').value;
            const phone = document.getElementById('inpPhone').value.trim();
            finalData = `tel:+${countryCode}${phone}`;
        }
        else if (type === 'email') {
            const email = document.getElementById('inpEmail').value;
            const sub = document.getElementById('inpSubject').value;
            const body = document.getElementById('inpBody').value;
            finalData = `mailto:${email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
        }
        else if (type === 'wifi') {
            const ssid = document.getElementById('inpSsid').value;
            const pass = document.getElementById('inpPass').value;
            const crypt = document.getElementById('inpCrypt').value;
            finalData = `WIFI:S:${ssid};T:${crypt};P:${pass};;`;
        }

        // --- NEW LOGIC ---

        else if (type === 'upi') {
            // UPI Format: upi://pay?pa=address&pn=name&am=amount&tn=note
            const pa = document.getElementById('inpUpiId').value.trim();
            const pn = document.getElementById('inpUpiName').value.trim();
            const am = document.getElementById('inpUpiAmount').value;
            const tn = document.getElementById('inpUpiNote').value;
            
            finalData = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}`;
            if(am) finalData += `&am=${am}&cu=INR`; // Currency defaults to INR for UPI
            if(tn) finalData += `&tn=${encodeURIComponent(tn)}`;
        }

        else if (type === 'sms') {
            // SMS Format: SMSTO:number:message
            const ph = document.getElementById('inpPhone').value;
            const msg = document.getElementById('inpSmsBody').value;
            finalData = `SMSTO:${ph}:${msg}`;
        }

        else if (type === 'vcard') {
            // VCard 3.0 Standard
            const n = document.getElementById('inpVcName').value;
            const ph = document.getElementById('inpVcPhone').value;
            const em = document.getElementById('inpVcEmail').value;
            const org = document.getElementById('inpVcOrg').value;
            
            // Basic Construction
            finalData = `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nTEL;TYPE=CELL:${ph}\nEMAIL:${em}\nORG:${org}\nEND:VCARD`;
        }

        else if (type === 'event') {
            // VEvent Standard (iCalendar)
            const title = document.getElementById('inpEvTitle').value;
            const loc = document.getElementById('inpEvLoc').value;
            
            // Format Dates to YYYYMMDDTHHMMSSZ (removing dashes/colons from ISO)
            const startRaw = document.getElementById('inpEvStart').value;
            const endRaw = document.getElementById('inpEvEnd').value;
            
            const fmtDate = (d) => d.replace(/[-:]/g, '') + "00";
            
            finalData = `BEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${loc}\nDTSTART:${fmtDate(startRaw)}\nDTEND:${fmtDate(endRaw)}\nEND:VEVENT`;
        }

        else if (type === 'geo') {
            // Geo URI
            const lat = document.getElementById('inpLat').value;
            const lon = document.getElementById('inpLon').value;
            finalData = `geo:${lat},${lon}`;
        }

        else if (type === 'crypto') {
            // Crypto URI: scheme:address?amount=...
            const scheme = document.getElementById('inpCryType').value;
            const addr = document.getElementById('inpCryAddr').value;
            const am = document.getElementById('inpCryAm').value;
            
            finalData = `${scheme}:${addr}`;
            if(am) finalData += `?amount=${am}`;
        }

        // Step 3: Render QR
        qrContainer.innerHTML = ""; 
        
        new QRCode(qrContainer, {
            text: finalData,
            width: parseInt(sizeSelect.value),
            height: parseInt(sizeSelect.value),
            colorDark: colorDarkSelect.value,
            colorLight: colorLightSelect.value,
            correctLevel: QRCode.CorrectLevel.M
        });

        setTimeout(() => { downloadBtn.style.display = 'block'; }, 100);

    } catch (e) {
        alert("Error generating QR code. Please check inputs.");
        console.error(e);
    }
}

// --- 7. KEYBOARD SHORTCUTS ---
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key.toLowerCase()) {
            case 'g': 
                e.preventDefault();
                generateBtn.click();
                break;
            case 'd': 
                e.preventDefault();
                if(downloadBtn.style.display !== 'none') downloadBtn.click();
                break;
            case 'm': 
                e.preventDefault();
                qrTypeSelector.focus();
                break;
            case 'i': 
                e.preventDefault();
                const firstInput = dynamicInputsDiv.querySelector('input, textarea, select');
                if(firstInput) firstInput.focus();
                break;
        }
    }
});

// --- 8. DOWNLOAD LOGIC ---
downloadBtn.addEventListener('click', () => {
    const img = qrContainer.querySelector('img');
    if (img && img.src) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `QR_Code_${Date.now()}.png`;
        link.click();
    }
});

// --- INITIALIZATION ---
qrTypeSelector.addEventListener('change', updateInputs);
generateBtn.addEventListener('click', generateQR);
updateInputs();