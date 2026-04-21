const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('Iniciando Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    
    // Generar PNG del DER
    console.log('Generando DER.png...');
    const derPage = await browser.newPage();
    await derPage.goto(`file://${path.resolve(__dirname, 'DER.html')}`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar a que se render mermaid
    const derElement = await derPage.$('.mermaid');
    if (derElement) {
      await derElement.screenshot({ path: 'DER.png' });
      console.log('✓ DER.png creado (640x480)');
    } else {
      console.log('✗ No se encontró elemento .mermaid');
    }
    await derPage.close();

    // Generar PDF del Manual
    console.log('Generando Manual-Usuario.pdf...');
    const manualPage = await browser.newPage();
    const htmlPath = path.resolve(__dirname, 'Manual-Usuario-combined.md');
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual de Usuario — CRM La Internacional</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
    h1 { color: #1a5490; font-size: 28px; page-break-after: avoid; }
    h2 { color: #0066cc; font-size: 20px; margin-top: 30px; page-break-after: avoid; }
    h3 { color: #0099ff; font-size: 16px; margin-top: 20px; page-break-after: avoid; }
    p { margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; page-break-inside: avoid; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #f5f5f5; font-weight: bold; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    pre { background: #f4f4f4; padding: 12px; border-radius: 3px; overflow-x: auto; }
    ul, ol { margin: 10px 0; padding-left: 30px; }
    li { margin: 5px 0; }
    .hr { page-break-after: always; }
    hr { border: 1px solid #ddd; }
    @media print {
      body { padding: 0; }
      .hr { height: 0; page-break-after: always; visibility: hidden; }
    }
  </style>
</head>
<body>
${require('fs').readFileSync('Manual-Usuario-combined.md', 'utf-8')
  .split('---').join('<hr class="hr">')}
</body>
</html>
    `;
    
    await manualPage.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await manualPage.pdf({ path: 'Manual-Usuario.pdf', format: 'A4', margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
    console.log('✓ Manual-Usuario.pdf creado');
    await manualPage.close();

    await browser.close();
    console.log('\n✓ Todos los archivos generados correctamente');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
