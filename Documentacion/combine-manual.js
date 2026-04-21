const fs = require('fs');
const path = require('path');

// Leer archivos markdown en orden
const manualFiles = [
  'Manual-Usuario/01-Introduccion.md',
  'Manual-Usuario/02-Login-Autenticacion.md',
  'Manual-Usuario/03-Clientes.md',
  'Manual-Usuario/04-Inbox-Conversaciones.md',
  'Manual-Usuario/05-Difusiones.md',
  'Manual-Usuario/06-Plantillas.md',
  'Manual-Usuario/07-Postventa.md',
  'Manual-Usuario/08-Analytics.md',
  'Manual-Usuario/09-Configuracion.md',
  'Manual-Usuario/10-FAQ-Troubleshooting.md'
];

// Combinar todos los archivos
let combined = '# Manual de Usuario — CRM La Internacional\n\n---\n\n';

manualFiles.forEach((file, index) => {
  const content = fs.readFileSync(file, 'utf-8');
  combined += content + '\n\n---\n\n';
});

// Guardar archivo combinado
fs.writeFileSync('Manual-Usuario-combined.md', combined, 'utf-8');
console.log('✓ Combinado: Manual-Usuario-combined.md');
