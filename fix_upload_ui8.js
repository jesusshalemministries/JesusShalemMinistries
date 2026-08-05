import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const target1 = `                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('image', file);
                          
                          setIsSaving(true);
                          setSaveStatus('Uploading QR code...');
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              headers: { 'Authorization': \`Bearer \${token}\` },
                              body: formData,
                            });
                            if (res.ok) {
                              const data = await res.json();
                              setLocalSettings({ ...localSettings, donationQrCode: data.url });
                              setSaveStatus('QR Code uploaded!');
                              setTimeout(() => setSaveStatus(null), 2000);
                            }
                          } catch (err) {
                            console.error(err);
                            setSaveStatus(err instanceof Error ? err.message : 'Upload failed');
                            setTimeout(() => setSaveStatus(null), 2000);
                          } finally {
                            setIsSaving(false);
                          }
                        }
                      }}`;

const rep1 = `                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleImageUpload(file);
                          if (url) {
                            setLocalSettings({ ...localSettings, donationQrCode: url });
                          }
                        }
                      }}`;


const target2 = `                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('image', file);
                            setIsSaving(true);
                            setSaveStatus('Uploading media...');
                            try {
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': \`Bearer \${token}\` },
                                body: formData,
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setGalleryForm({ ...galleryForm, url: data.url });
                                setSaveStatus('Media uploaded!');
                                setTimeout(() => setSaveStatus(null), 2000);
                              }
                            } catch (err) {
                              console.error(err);
                              setSaveStatus(err instanceof Error ? err.message : 'Upload failed');
                              setTimeout(() => setSaveStatus(null), 2000);
                            } finally {
                              setIsSaving(false);
                            }
                          }
                        }}`;

const rep2 = `                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file);
                            if (url) {
                              setGalleryForm({ ...galleryForm, url: url });
                            }
                          }
                        }}`;

code = code.replace(target1, rep1).replace(target2, rep2);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Replaced target1 and target2!");
