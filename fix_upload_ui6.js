import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const startIdx = code.indexOf('const handleImageUpload = async (file: File): Promise<string | null> => {');
const endIdxStr = 'return null;\n    }\n  };';
const endIdx = code.indexOf(endIdxStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
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

    code = code.substring(0, startIdx) + replacement + code.substring(endIdx + endIdxStr.length);
    fs.writeFileSync('src/components/AdminPanel.tsx', code);
    console.log("Successfully replaced using indexOf!");
} else {
    console.log("Could not find start or end index.");
    console.log("startIdx:", startIdx, "endIdx:", endIdx);
}
