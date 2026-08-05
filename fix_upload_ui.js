import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// The original uses res.ok to check for success, so if it fails, it might throw an error or just go to else
// Actually, let's just do a generic replace on the fetch logic in handleImageUpload and gallery upload
code = code.replace(/setSaveStatus\('Upload failed'\);/g, "setSaveStatus(err instanceof Error ? err.message : 'Upload failed');");
fs.writeFileSync('src/components/AdminPanel.tsx', code);
