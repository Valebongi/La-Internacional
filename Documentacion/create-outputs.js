const fs = require('fs');
const path = require('path');

// Leer el manual combinado
const manualContent = fs.readFileSync('Manual-Usuario-combined.md', 'utf-8');

// Crear HTML con jsPDF y html2canvas embebidos
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual de Usuario — CRM La Internacional</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  
      line-height: 1.6; 
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .controls {
      text-align: center;
      margin-bottom: 20px;
    }
    button {
      background: #0066cc;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin: 0 10px;
    }
    button:hover { background: #0052a3; }
    #content {
      max-width: 960px;
      margin: 20px auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #1a5490; font-size: 28px; margin-top: 40px; margin-bottom: 20px; page-break-after: avoid; }
    h2 { color: #0066cc; font-size: 20px; margin-top: 30px; margin-bottom: 15px; page-break-after: avoid; }
    h3 { color: #0099ff; font-size: 16px; margin-top: 20px; margin-bottom: 10px; page-break-after: avoid; }
    h4, h5, h6 { margin-top: 15px; margin-bottom: 10px; }
    p { margin-bottom: 10px; text-align: justify; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 15px 0; 
      page-break-inside: avoid;
      font-size: 14px;
    }
    th, td { 
      border: 1px solid #ddd;  
      padding: 12px;
      text-align: left;
    }
    th { background: #f5f5f5; font-weight: bold; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { 
      background: #f4f4f4; 
      padding: 2px 6px; 
      border-radius: 3px; 
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    pre { 
      background: #f4f4f4; 
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 15px 0;
      font-size: 12px;
      page-break-inside: avoid;
    }
    ul, ol { 
      margin: 10px 0 10px 30px;
    }
    li { 
      margin-bottom: 5px;
    }
    hr { 
      border: none; 
      border-top: 3px solid #1a5490;
      margin: 40px 0;
      page-break-after: always;
    }
    .hr { page-break-after: always; }
    em { font-style: italic; }
    strong { font-weight: bold; }
    blockquote { 
      border-left: 4px solid #0066cc;
      padding-left: 15px;
      margin: 15px 0;
      color: #666;
      font-style: italic;
    }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .success { color: #28a745; font-weight: bold; }
    .error { color: #dc3545; font-weight: bold; }
    .warning { color: #ffc107; font-weight: bold; }
    @media print {
      body { background: white; padding: 0; }
      #content { box-shadow: none; margin: 0; padding: 0; }
      .controls { display: none; }
      a { color: inherit; }
    }
  </style>
</head>
<body>
  <div class="controls">
    <button onclick="generatePDF()">📥 Descargar PDF</button>
  </div>
  <div id="content">
${markdownToHtml(manualContent)}
  </div>
  <script>
    function generatePDF() {
      const element = document.getElementById('content');
      const opt = {
        margin: 10,
        filename: 'Manual-Usuario.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4' }
      };
      html2pdf().set(opt).save(opt.filename).from(element).save();
    }
  </script>
</body>
</html>
`;

function markdownToHtml(md) {
  let html = md;
  
  // Encabezados
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Código
  html = html.replace(/\`\`\`[a-z]*\n([\s\S]*?)\`\`\`/gm, '<pre><code>$1</code></pre>');
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
  
  // Negritas e itálicas
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Listas
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(\<li>.*?\<\/li>)/s, function(match) {
    return '<ul>' + match + '</ul>';
  });
  
  // Horizontales
  html = html.replace(/^---$/gm, '<hr>');
  
  // Párrafos
  html = html.replace(/([^\\n])\n\n/g, '$1</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  
  // Quitar etiquetas p de headings
  html = html.replace(/<p>(<h[1-6])/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  
  return html;
}

// Guardar HTML
fs.writeFileSync('Manual-Usuario.html', htmlContent, 'utf-8');
console.log('✓ Manual-Usuario.html creado (abre en navegador y haz clic en "Descargar PDF")');

// Crear HTML del DER también
const derHtml = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>DER - CRM La Internacional</title><script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}.container{max-width:1200px;margin:0 auto;background:white;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}h1{color:#1a5490;text-align:center;margin-bottom:30px}.controls{text-align:center;margin-bottom:20px}button{background:#0066cc;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;font-size:14px}button:hover{background:#0052a3}.mermaid{display:flex;justify-content:center}@media print{button{display:none}}<\/style></head><body><div class="container"><h1>Diagrama Entidad-Relación — CRM La Internacional<\/h1><div class="controls"><button onclick="capturePNG()">📸 Capturar como PNG<\/button><button onclick="window.print()">🖨️ Imprimir / Guardar PDF<\/button><\/div><div class="mermaid">erDiagram\n    USERS ||--o{ REFRESH_TOKEN : generates\n    USERS ||--o{ CLIENT : advisor_id\n    USERS ||--o{ CONVERSATION : advisor_id\n    USERS ||--o{ MESSAGE : from_user_id\n    USERS ||--o{ BROADCAST : created_by\n    USERS ||--o{ POSTSALE_SEQUENCE : created_by\n    CLIENT_TYPE ||--o{ CLIENT : "has many"\n    CLIENT ||--o{ CLIENT_TAG : tags\n    TAG ||--o{ CLIENT_TAG : "tagged by"\n    CLIENT ||--o{ CLIENT_STATE_HISTORY : "state changes"\n    CLIENT ||--o{ CONVERSATION : "has many"\n    CHANNEL ||--o{ CONVERSATION : "has many"\n    CONVERSATION ||--o{ MESSAGE : "contains"\n    CONVERSATION ||--o{ CONVERSATION_TAG : tags\n    TAG ||--o{ CONVERSATION_TAG : "tagged by"\n    BROADCAST ||--o{ BROADCAST_RECIPIENT : "sends to"\n    CLIENT ||--o{ BROADCAST_RECIPIENT : "receives"\n    BROADCAST_RECIPIENT ||--o{ MESSAGE : "creates"\n    WEBHOOK_EVENT ||--o{ MESSAGE : "triggers"\n    POSTSALE_SEQUENCE ||--o{ POSTSALE_TRIGGER : triggers\n    POSTSALE_SEQUENCE ||--o{ POSTSALE_LOG : "logs execution"\n    CLIENT ||--o{ POSTSALE_LOG : "subject"\n    ANALYTICS_SESSION ||--o{ ANALYTICS_METRIC : contains\n<\/div><script>mermaid.initialize({startOnLoad:true,theme:"default"});mermaid.contentLoaded();async function capturePNG(){const canvas=await html2canvas(document.querySelector(".mermaid"));const link=document.createElement("a");link.href=canvas.toDataURL();link.download="DER.png";link.click();}<\/script><\/div><\/body><\/html>'