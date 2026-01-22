// --- LOGIC PART ---

// Base62 characters set (custom order)
const base62chars = ".^,#<+=@'&TSLABCDEFGHIJKMNOPQRUVWXYZtslabcdefghijkmnopqruvwxyz";
const OFFSET = 143;

// Helper: Decimal to Base62
function decToBase62(num) {
  if(num === 0) return base62chars[0];
  let result = "";
  while(num > 0) {
    result = base62chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

// Helper: Base62 to Decimal
function base62ToDec(str) {
  let result = 0;
  for(let i=0; i<str.length; i++) {
    const val = base62chars.indexOf(str[i]);
    if(val === -1) return -1;
    result = result * 62 + val;
  }
  return result;
}

// Encode Function (Uses % as delimiter)
function encode(str) {
  let encoded = "";
  for(let ch of str) {
    const code = ch.charCodeAt(0);
    const val = code + OFFSET;
    const base62val = decToBase62(val);
    encoded += "%" + base62val;
  }
  return encoded;
}

// Decode Function
function decode(str) {
  if(str.length === 0) return "";
  if(str[0] !== "%") throw new Error("Invalid format: missing '%' at start");

  const parts = str.split("%");
  if(parts[0] === "") parts.shift(); // Remove empty first part

  let decoded = "";
  for(let part of parts) {
    if(part.length === 0) continue;
    const val = base62ToDec(part);
    if(val === -1) throw new Error("Corrupted data block");
    const code = val - OFFSET;
    if(code < 0 || code > 65535) throw new Error("Value out of range");
    decoded += String.fromCharCode(code);
  }
  return decoded;
}

// --- UI PART ---

const toggleBtn = document.getElementById("toggleBtn");
const inputText = document.getElementById("inputText");
const actionBtn = document.getElementById("actionBtn");
const copyBtn = document.getElementById("copyBtn");
const pasteBtn = document.getElementById("pasteBtn");
const clearBtn = document.getElementById("clearBtn");
const errorMsg = document.getElementById("errorMsg");
const pageHeader = document.getElementById("pageHeader");

let isEncode = true;

// This function updates texts for Buttons, Header and Placeholder
function updateMode() {
  if(isEncode) {
    // ENCODE MODE
    toggleBtn.textContent = "Switch to Decode Mode";
    actionBtn.textContent = "Encode Text";
    pageHeader.textContent = "Text Encoder";
    inputText.placeholder = "Type your normal text here to encode...";
    pasteBtn.style.display = "none";
  } else {
    // DECODE MODE
    toggleBtn.textContent = "Switch to Encode Mode";
    actionBtn.textContent = "Decode Text";
    pageHeader.textContent = "Text Decoder";
    inputText.placeholder = "Paste the encoded code (starts with %) here to decode...";
    pasteBtn.style.display = "inline-block";
  }
  errorMsg.style.display = "none";
  errorMsg.textContent = "";
  inputText.focus();
}

// Click Listeners
toggleBtn.addEventListener("click", () => {
  isEncode = !isEncode;
  updateMode();
});

actionBtn.addEventListener("click", () => {
  errorMsg.style.display = "none";
  try {
    const text = inputText.value;
    if(!text) return;

    if(isEncode) {
      inputText.value = encode(text);
    } else {
      inputText.value = decode(text);
    }
  } catch(e) {
    errorMsg.textContent = "Error: " + e.message;
    errorMsg.style.display = "block";
  }
});

copyBtn.addEventListener("click", () => {
  if(!inputText.value) return;
  inputText.select();
  navigator.clipboard.writeText(inputText.value)
    .then(() => {
      const oldText = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = oldText; }, 1500);
    })
    .catch(() => {
      errorMsg.textContent = "Copy failed";
      errorMsg.style.display = "block";
    });
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputText.value = text;
    inputText.focus();
  } catch (e) {
    errorMsg.textContent = "Paste failed";
    errorMsg.style.display = "block";
  }
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  errorMsg.style.display = "none";
  inputText.focus();
});

// --- KEYBOARD SHORTCUTS (Invisible) ---
document.addEventListener('keydown', (e) => {
  if (e.altKey) {
    const key = e.key.toLowerCase();
    
    // Alt + M : Change Mode
    if (key === 'm') {
      e.preventDefault();
      toggleBtn.click();
    }
    // Alt + D : Do Action (Encode/Decode)
    else if (key === 'd') {
      e.preventDefault();
      actionBtn.click();
    }
    // Alt + C : Copy
    else if (key === 'c') {
      e.preventDefault();
      copyBtn.click();
    }
  }
});

// Run once on load to set initial state
updateMode();
