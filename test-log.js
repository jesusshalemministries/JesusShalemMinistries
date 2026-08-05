import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf-8');
const script = `
<script>
  window.onerror = function(msg, src, lineno, colno, error) {
    fetch('/api/settings', { method: 'POST', body: JSON.stringify({ error: msg + ' ' + (error ? error.stack : '') }) });
  }
  const originalConsoleError = console.error;
  console.error = function(...args) {
    fetch('/api/settings', { method: 'POST', body: JSON.stringify({ error: args.join(' ') }) });
    originalConsoleError.apply(console, args);
  }
</script>
`;
fs.writeFileSync('index.html', html.replace('<head>', '<head>' + script));
