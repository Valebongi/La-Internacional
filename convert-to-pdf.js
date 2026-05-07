#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Intentar con marked y html-pdf si están disponibles
try {
  const marked = require('marked');
  const htmlPdf = require('html-pdf');

  const mdFile = path.join(__dirname, 'PRESUPUESTO.md');
  const pdfFile = path.join(__dirname, 'PRESUPUESTO.pdf');

  // Leer el archivo markdown
  const markdownContent = fs.readFileSync(mdFile, 'utf-8');

  // Convertir markdown a HTML
  const htmlContent = marked.parse(markdownContent);

  // Envolver en HTML completo con CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: white;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #0066cc;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        h1 { font-size: 28px; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
        h2 { font-size: 22px; margin-top: 25px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        p { margin: 10px 0; text-align: justify; }
        ul, ol { margin: 15px 0; padding-left: 30px; }
        li { margin: 8px 0; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
          color: #0066cc;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        code, tt {
          background-color: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        blockquote {
          border-left: 4px solid #0066cc;
          margin: 15px 0;
          padding-left: 20px;
          color: #666;
          font-style: italic;
        }
        hr {
          border: none;
          border-top: 2px solid #0066cc;
          margin: 30px 0;
          page-break-after: avoid;
        }
        strong { color: #0066cc; font-weight: bold; }
        em { font-style: italic; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const options = {
    format: 'A4',
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    },
    border: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  };

  htmlPdf.create(fullHtml, options).toFile(pdfFile, (err, res) => {
    if (err) {
      console.error('Error generando PDF:', err);
      process.exit(1);
    }
    console.log(`✅ PDF generado exitosamente: ${pdfFile}`);
    process.exit(0);
  });

} catch (error) {
  console.error('Dependencias faltantes. Instala:', error.message);
  console.log('\nIntentando instalación automática...');
  
  const { execSync } = require('child_process');
  try {
    execSync('npm install marked html-pdf', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas. Reinicia el script.');
  } catch (e) {
    console.error('No se pudo instalar automáticamente.');
    process.exit(1);
  }
}
