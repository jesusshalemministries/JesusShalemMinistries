import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const target = `  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      setIsSaving(true);
      setSaveStatus('Uploading image...');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${token}\`,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSaveStatus('Image uploaded!');
        setTimeout(() => setSaveStatus(null), 2000);
        return data.url;
      } else {
        const err = await res.json();
        setSaveStatus('Upload failed: ' + (err.error || 'Unknown error'));
        setTimeout(() => setSaveStatus(null), 3000);
        return null;
      }
    } catch (e: any) {
      setSaveStatus('Upload error: ' + e.message);
      setTimeout(() => setSaveStatus(null), 3000);
      return null;
    }
  };`;

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

code = code.replace(target, replacement);

// There was a previous fix I did manually using sed or something that changed a line to 'setSaveStatus(err instanceof Error ...)'
// I'll just use a regex that catches everything inside handleImageUpload.
const regex = /const handleImageUpload = async \(file: File\): Promise<string \| null> => \{[\s\S]*?return null;\n\s*\}\n\s*\};/m;
code = code.replace(regex, replacement);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
