        const imageInput = document.getElementById('imageInput');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const fileInfo = document.getElementById('fileInfo');
        const sizeInfo = document.getElementById('sizeInfo');
        const downloadBtn = document.getElementById('downloadBtn');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        let originalFile = null;
        let compressedBlob = null;

        // Helper function to format file size (Bytes to KB/MB)
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        // 1. File Select hole ki hobe
        imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                originalFile = e.target.files[0];
                fileInfo.textContent = `Selected: ${originalFile.name}`;
                processImage(); // File nilei compression process shuru
            }
        });

        // 2. Slider sorale ki hobe
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value + "%";
            if (originalFile) {
                processImage(); // Slider change holei abar process hobe
            }
        });

        // 3. Main Image Processing Function
        function processImage() {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Canvas-e chobi aka
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Quality ber kora (Slider value 1-100, kintu JS chay 0.1 - 1.0)
                    const quality = qualitySlider.value / 100;

                    // Canvas theke Blob banano (Compress kora)
                    // Default JPEG format use korchi compression-er jonyo best result pete
                    let outputFormat = 'image/jpeg';
                    
                    // Jodi input PNG hoy ar transparency thake, tobe PNG rakhte hobe (tobe PNG te compression kom hoy)
                    if (originalFile.type === 'image/png') {
                        // PNG te standard canvas API te quality parameter kaj kore na onek browser-e.
                        // Tai WebP use kora better compression-er jonyo jodi user-er browser support kore.
                        outputFormat = 'image/webp'; 
                    }

                    canvas.toBlob((blob) => {
                        compressedBlob = blob;
                        
                        // Size compare kora
                        const originalSize = formatBytes(originalFile.size);
                        const newSize = formatBytes(compressedBlob.size);
                        
                        // Status update kora (Screen reader porbe)
                        sizeInfo.innerHTML = `Original Size: <b>${originalSize}</b> <br> New Size: <b>${newSize}</b> (at ${qualitySlider.value}% quality)`;
                        
                        // Download button ready kora
                        downloadBtn.style.display = 'inline-block';
                        downloadBtn.onclick = downloadImage;

                    }, outputFormat, quality);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(originalFile);
        }

        // 4. Download Function with Custom Filename
        function downloadImage() {
            if (!compressedBlob) return;

            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            
            // Filename logic: originalName (quality X%).ext
            // Extension alada kora
            const lastDotIndex = originalFile.name.lastIndexOf('.');
            const nameWithoutExt = originalFile.name.substring(0, lastDotIndex);
            
            // Output extension thik kora
            let ext = 'jpg';
            if (originalFile.type === 'image/png') ext = 'webp'; // Since we converted PNG to WebP for better compression

            a.href = url;
            // Ekhane tor chawa logic onujayi naam dewa holo
            a.download = `${nameWithoutExt} (quality ${qualitySlider.value}%).${ext}`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
