import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /const handleImageUpload = async \(file: File\): Promise<string \| null> => \{[\s\S]*?body: formData,\n\s*\}\);\n\s*if \(res.ok\) \{[\s\S]*?\} catch \(e: any\) \{[\s\S]*?return null;\n\s*\}\n\s*\};/m;

const replacement = `const handleImageUpload = async (file: File): Promise<string | null> => {
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

const match = code.match(regex);
if (match) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/AdminPanel.tsx', code);
    console.log("Matched and replaced!");
} else {
    console.log("No match found.");
}
