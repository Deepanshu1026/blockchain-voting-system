import { useState, useRef } from "react";
import Tesseract from "tesseract.js";

export default function IDUploader({ onScanComplete }) {
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const processImage = (file) => {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setScanning(true);
        setProgress(0);

        Tesseract.recognize(
            file,
            'eng',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(parseInt(m.progress * 100));
                    }
                }
            }
        ).then(({ data: { text } }) => {
            console.log("OCR Text:", text);
            // Regex for 12 digit number (Aadhaar format: xxxx xxxx xxxx or xxxxxxxxxxxx)
            const aadhaarPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
            const match = text.match(aadhaarPattern);

            if (match) {
                const cleanId = match[0].replace(/\s/g, '');
                onScanComplete(cleanId);
            } else {
                alert("Could not detect a valid 12-digit ID. Please ensure the image is clear or try entering manually.");
                onScanComplete(null);
            }
            setScanning(false);
        }).catch(err => {
            console.error(err);
            setScanning(false);
            alert("Error scanning image.");
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    };

    return (
        <div
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
        >
            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => e.target.files[0] && processImage(e.target.files[0])}
            />

            {scanning ? (
                <div>
                    <div className="spinner"></div>
                    <p>Scanning ID... {progress}%</p>
                </div>
            ) : preview ? (
                <img src={preview} alt="ID Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
            ) : (
                <div>
                    <p style={{ fontSize: "2rem", margin: 0 }}>📂</p>
                    <p>Click or Drag Aadhaar Card Here</p>
                    <small style={{ opacity: 0.7 }}>We will auto-detect your 12-digit ID</small>
                </div>
            )}
        </div>
    );
}
