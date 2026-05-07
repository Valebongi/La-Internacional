#!/usr/bin/env python3
"""
Generador de PDF desde Markdown - Solución simple
Usa reportlab para generar PDF sin dependencias externas complicadas
"""

import os
import re
from pathlib import Path

def simple_md_to_pdf():
    """Convierte Markdown a PDF usando una librería simple"""
    
    md_file = Path(__file__).parent / "PRESUPUESTO.md"
    pdf_file = Path(__file__).parent / "PRESUPUESTO.pdf"
    
    if not md_file.exists():
        print(f"❌ Archivo no encontrado: {md_file}")
        return False
    
    try:
        # Intentar con reportlab
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import mm, inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
        
        # Leer markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Crear documento PDF
        doc = SimpleDocTemplate(
            str(pdf_file),
            pagesize=A4,
            rightMargin=15*mm,
            leftMargin=15*mm,
            topMargin=15*mm,
            bottomMargin=15*mm
        )
        
        # Estilos
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(
            name='Titulo',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=20,
            alignment=TA_CENTER,
            borderBottomWidth=2,
            borderBottomColor=colors.HexColor('#0066cc')
        ))
        styles.add(ParagraphStyle(
            name='Heading2Custom',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=12,
            spaceBefore=12
        ))
        styles.add(ParagraphStyle(
            name='BodyJustified',
            parent=styles['BodyText'],
            alignment=TA_JUSTIFY,
            fontSize=11
        ))
        
        story = []
        
        # Parsear línea por línea
        lines = content.split('\n')
        i = 0
        
        while i < len(lines):
            line = lines[i]
            
            # Títulos
            if line.startswith('# '):
                story.append(Paragraph(line[2:], styles['Titulo']))
                story.append(Spacer(1, 0.3*inch))
            elif line.startswith('## '):
                story.append(Paragraph(line[3:], styles['Heading2Custom']))
                story.append(Spacer(1, 0.2*inch))
            elif line.startswith('### '):
                story.append(Paragraph(line[4:], styles['Heading3']))
                story.append(Spacer(1, 0.1*inch))
            elif line.startswith('#### '):
                story.append(Paragraph(line[5:], styles['Heading4']))
                story.append(Spacer(1, 0.08*inch))
            
            # Líneas vacías
            elif not line.strip():
                story.append(Spacer(1, 0.15*inch))
            
            # Separadores
            elif line.strip() == '---':
                story.append(Spacer(1, 0.1*inch))
                story.append(PageBreak())
            
            # Listas
            elif line.strip().startswith('- '):
                bullet_text = line.strip()[2:]
                story.append(Paragraph(f"• {bullet_text}", styles['BodyJustified']))
                story.append(Spacer(1, 0.08*inch))
            
            elif line.strip().startswith('* '):
                bullet_text = line.strip()[2:]
                story.append(Paragraph(f"• {bullet_text}", styles['BodyJustified']))
                story.append(Spacer(1, 0.08*inch))
            
            # Tablas (detección básica)
            elif '|' in line and i + 1 < len(lines) and '|' in lines[i + 1]:
                table_lines = [line]
                i += 1
                while i < len(lines) and '|' in lines[i]:
                    table_lines.append(lines[i])
                    i += 1
                i -= 1  # Retroceder uno porque el bucle lo adelantará
                
                # Parsear tabla
                table_data = []
                for table_line in table_lines:
                    if '---' not in table_line:
                        cells = [cell.strip() for cell in table_line.split('|')[1:-1]]
                        table_data.append(cells)
                
                if table_data:
                    table_obj = Table(table_data, colWidths=[2.5*cm for _ in range(len(table_data[0]))])
                    table_obj.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f0f0f0')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0066cc')),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 10),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cccccc')),
                        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9f9f9')]),
                    ]))
                    story.append(table_obj)
                    story.append(Spacer(1, 0.2*inch))
            
            # Párrafos normales
            elif line.strip() and not line.startswith(('```', '---', '|', '**')):
                # Formatear texto con bold/italic
                formatted = line.strip()
                formatted = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', formatted)
                formatted = re.sub(r'__(.*?)__', r'<b>\1</b>', formatted)
                formatted = re.sub(r'\*(.*?)\*', r'<i>\1</i>', formatted)
                formatted = re.sub(r'_(.*?)_', r'<i>\1</i>', formatted)
                
                story.append(Paragraph(formatted, styles['BodyJustified']))
                story.append(Spacer(1, 0.1*inch))
            
            i += 1
        
        # Generar PDF
        doc.build(story)
        print(f"✅ PDF generado exitosamente: {pdf_file}")
        return True
        
    except ImportError:
        print("⚠️  Instalando reportlab...")
        import subprocess
        try:
            subprocess.run(['pip', 'install', 'reportlab'], check=True)
            print("✅ reportlab instalado. Intenta nuevamente.")
            return False
        except Exception as e:
            print(f"❌ Error al instalar: {e}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    import sys
    success = simple_md_to_pdf()
    sys.exit(0 if success else 1)
