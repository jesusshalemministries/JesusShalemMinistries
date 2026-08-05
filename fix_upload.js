import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/app\.post\('\/api\/upload', requireAdmin, upload\.single\('image'\), \(req, res\) => \{[\s\S]*?res\.json\(\{ url: imageUrl \}\);\n\}\);/m, 
`app.post('/api/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const imageUrl = \\\`/uploads/\${req.file.filename}\\\`;
    res.json({ url: imageUrl });
  });
});`);
fs.writeFileSync('server.ts', code);
