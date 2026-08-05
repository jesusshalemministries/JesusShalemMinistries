import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const target = "  const handleImageUpload = async (file: File): Promise<string | null> => {\n" +
"    const formData = new FormData();\n" +
"    formData.append('image', file);\n" +
"    try {\n" +
"      setIsSaving(true);\n" +
"      setSaveStatus('Uploading image...');\n" +
"      const res = await fetch('/api/upload', {\n" +
"        method: 'POST',\n" +
"        headers: {\n" +
"          'Authorization': `Bearer ${token}`,\n" +
"        },\n" +
"        body: formData,\n" +
"      });\n" +
"      if (res.ok) {\n" +
"        const data = await res.json();\n" +
"        setSaveStatus('Image uploaded!');\n" +
"        setTimeout(() => setSaveStatus(null), 2000);\n" +
"        return data.url;\n" +
"      } else {\n" +
"        const err = await res.json();\n" +
"        setSaveStatus('Upload failed: ' + (err.error || 'Unknown error'));\n" +
"        setTimeout(() => setSaveStatus(null), 3000);\n" +
"        return null;\n" +
"      }\n" +
"    } catch (e: any) {\n" +
"      setSaveStatus('Upload error: ' + e.message);\n" +
"      setTimeout(() => setSaveStatus(null), 3000);\n" +
"      return null;\n" +
"    }\n" +
"  };";

const replacement = `  const handleImageUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      setIsSaving(true);
      setSaveStatus('Processing image...');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSaveStatus('Image processed!');
        setTimeout(() => setSaveStatus(null), 2000);
        setIsSaving(false);
        resolve(e.target?.result as string);
      };
      reader.onerror = (e) => {
        setSaveStatus('Image processing failed');
        setTimeout(() => setSaveStatus(null), 3000);
        setIsSaving(false);
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };`;

// Use simple indexOf to make sure we replace exactly
const idx = code.indexOf(target);
if (idx !== -1) {
    code = code.substring(0, idx) + replacement + code.substring(idx + target.length);
    fs.writeFileSync('src/components/AdminPanel.tsx', code);
    console.log("Successfully replaced");
} else {
    console.log("Target not found!");
}
