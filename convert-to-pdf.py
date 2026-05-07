#!/usr/bin/env python3
"""
Convertidor de Markdown a PDF
Requiere: pip install markdown2 pdfkit wkhtmltopdf
"""

import os
import sys
import subprocess
from pathlib import Path

def convert_md_to_pdf():
    script_dir = Path(__file__).parent
    md_file = script_dir / "PRESUPUESTO.md"
    pdf_file = script_dir / "PRESUPUESTO.pdf"
    
    if not md_file.exists():
        print(f"❌ Archivo no encontrado: {md_file}")
        return False
    
    try:
        # Intenta con pandoc primero (mejor calidad)
        try:
            cmd = [
                'pandoc',
                str(md_file),
                '-o', str(pdf_file),
                '--from=markdown',
                '--to=pdf',
                '-V', 'margin-top=20mm',
                '-V', 'margin-bottom=20mm',
                '-V', 'margin-left=15mm',
                '-V', 'margin-right=15mm',
                '--highlight-style=pygments'
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"✅ PDF generado con pandoc: {pdf_file}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Alternativa con markdown2 + pdfkit + wkhtmltopdf
        try:
            import markdown2
            import pdfkit
            
            with open(md_file, 'r', encoding='utf-8') as f:
                md_content = f.read()
            
            html_content = markdown2.markdown(md_content)
            
            html_with_style = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }}
                    h1, h2, h3, h4, h5, h6 {{
                        color: #0066cc;
                        margin-top: 25px;
                        margin-bottom: 15px;
                    }}
                    h1 {{ font-size: 28px; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }}
                    h2 {{ font-size: 22px; }}
                    h3 {{ font-size: 18px; }}
                    table {{
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }}
                    th, td {{
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }}
                    th {{
                        background-color: #f0f0f0;
                        font-weight: bold;
                        color: #0066cc;
                    }}
                    tr:nth-child(even) {{ background-color: #f9f9f9; }}
                    code {{
                        background-color: #f4f4f4;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: 'Courier New', monospace;
                    }}
                    blockquote {{
                        border-left: 4px solid #0066cc;
                        padding-left: 20px;
                        color: #666;
                    }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            
            options = {
                'page-size': 'A4',
                'margin-top': '15mm',
                'margin-right': '15mm',
                'margin-bottom': '15mm',
                'margin-left': '15mm',
                'encoding': 'UTF-8',
            }
            
            pdfkit.from_string(html_with_style, str(pdf_file), options=options)
            print(f"✅ PDF generado con pdfkit: {pdf_file}")
            return True
        except ImportError:
            pass
        
        # Si nada funcionó, mostrar error
        print("❌ No se encontraron herramientas de conversión.")
        print("Instala una de estas opciones:")
        print("  - pandoc: https://pandoc.org/installing.html")
        print("  - pdfkit + wkhtmltopdf: pip install pdfkit && choco install wkhtmltopdf")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = convert_md_to_pdf()
    sys.exit(0 if success else 1)
