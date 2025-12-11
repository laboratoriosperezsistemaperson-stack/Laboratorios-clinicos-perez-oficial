/**
 * export-pruebas.js
 * Funciones para exportar catálogo de pruebas a PDF y Excel
 */

// Exportar pruebas a Excel con formato profesional
async function exportarPruebasExcel(pruebas) {
    try {
        const wb = XLSX.utils.book_new();

        const data = [
            ['LABORATORIO CLINICO PEREZ'],
            ['CATALOGO DE PRUEBAS DE LABORATORIO'],
            ['Fecha: ' + new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })],
            [],
            ['#', 'NOMBRE DE LA PRUEBA', 'CATEGORIA', 'PRECIO (Bs.)', 'DESCRIPCION', 'ESTADO']
        ];

        pruebas.forEach((p, i) => {
            data.push([
                i + 1,
                p.nombre || 'N/A',
                p.categoria || 'General',
                p.precio ? parseFloat(p.precio).toFixed(2) : '0.00',
                p.descripcion || '',
                p.activo !== false ? 'Disponible' : 'No Disponible'
            ]);
        });

        data.push([]);
        data.push(['TOTAL DE PRUEBAS:', pruebas.length]);

        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!cols'] = [
            { width: 5 },   // #
            { width: 45 },  // Nombre
            { width: 20 },  // Categoria
            { width: 15 },  // Precio
            { width: 40 },  // Descripcion
            { width: 15 }   // Estado
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Catalogo Pruebas');
        XLSX.writeFile(wb, `Catalogo_Pruebas_${new Date().toISOString().split('T')[0]}.xlsx`);

        return true;
    } catch (error) {
        console.error('Error exportando pruebas a Excel:', error);
        alert('Error al exportar pruebas a Excel');
        return false;
    }
}

// Exportar pruebas a PDF profesional
async function exportarPruebasPDF(pruebas) {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let y = margin;

        // Cabecera
        pdf.setFillColor(243, 156, 18);
        pdf.rect(0, 0, pageWidth, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        pdf.text('LABORATORIO CLINICO PEREZ', pageWidth / 2, 18, { align: 'center' });

        pdf.setFontSize(14);
        pdf.text('Catalogo de Pruebas de Laboratorio', pageWidth / 2, 30, { align: 'center' });

        y = 50;

        pdf.setTextColor(100);
        pdf.setFontSize(10);
        pdf.text('Fecha: ' + new Date().toLocaleDateString('es-BO'), margin, y);
        pdf.text('Total: ' + pruebas.length + ' pruebas', pageWidth - margin - 40, y);
        y += 12;

        // Encabezados de tabla
        const colWidths = [10, 65, 30, 25, 35];
        const headers = ['#', 'PRUEBA', 'CATEGORIA', 'PRECIO', 'ESTADO'];

        pdf.setFillColor(44, 62, 80);
        pdf.rect(margin, y, pageWidth - margin * 2, 10, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');

        let x = margin + 2;
        headers.forEach((h, i) => {
            pdf.text(h, x, y + 7);
            x += colWidths[i];
        });
        y += 12;

        // Datos
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);

        pruebas.forEach((p, i) => {
            if (y > pdf.internal.pageSize.getHeight() - 25) {
                pdf.addPage();
                y = margin;
            }

            if (i % 2 === 0) {
                pdf.setFillColor(248, 249, 250);
                pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
            }

            pdf.setTextColor(50, 50, 50);
            x = margin + 2;
            const row = [
                (i + 1).toString(),
                (p.nombre || 'N/A').substring(0, 40),
                (p.categoria || 'General').substring(0, 18),
                'Bs. ' + (p.precio ? parseFloat(p.precio).toFixed(2) : '0.00'),
                p.activo !== false ? 'Disponible' : 'No Disp.'
            ];

            row.forEach((val, j) => {
                pdf.text(val, x, y);
                x += colWidths[j];
            });
            y += 8;
        });

        // Pie
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('Sistema Lab Perez - ' + new Date().toLocaleString(), pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

        pdf.save(`Catalogo_Pruebas_${new Date().toISOString().split('T')[0]}.pdf`);
        return true;
    } catch (error) {
        console.error('Error exportando pruebas a PDF:', error);
        alert('Error al exportar pruebas a PDF');
        return false;
    }
}
