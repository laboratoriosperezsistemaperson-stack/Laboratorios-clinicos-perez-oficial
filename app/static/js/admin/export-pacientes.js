/**
 * export-pacientes.js
 * Funciones para exportar datos de pacientes a PDF y Excel
 */

// Exportar pacientes a Excel con formato profesional
async function exportarPacientesExcel(pacientes) {
    try {
        const wb = XLSX.utils.book_new();

        // Datos con encabezados
        const data = [
            ['LABORATORIO CLINICO PEREZ'],
            ['REPORTE DE PACIENTES'],
            ['Fecha: ' + new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })],
            [],
            ['#', 'NOMBRE COMPLETO', 'CI', 'TELEFONO', 'EMAIL', 'FECHA REGISTRO', 'ESTADO']
        ];

        // Agregar pacientes
        pacientes.forEach((p, i) => {
            data.push([
                i + 1,
                p.nombre || 'N/A',
                p.ci || 'N/A',
                p.telefono || 'N/A',
                p.email || 'N/A',
                p.fecha_registro || 'N/A',
                p.activo !== false ? 'Activo' : 'Inactivo'
            ]);
        });

        // Resumen
        data.push([]);
        data.push(['TOTAL DE PACIENTES:', pacientes.length]);

        const ws = XLSX.utils.aoa_to_sheet(data);

        // Anchos de columna
        ws['!cols'] = [
            { width: 5 },   // #
            { width: 30 },  // Nombre
            { width: 15 },  // CI
            { width: 15 },  // Telefono
            { width: 30 },  // Email
            { width: 18 },  // Fecha
            { width: 12 }   // Estado
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
        XLSX.writeFile(wb, `Pacientes_${new Date().toISOString().split('T')[0]}.xlsx`);

        return true;
    } catch (error) {
        console.error('Error exportando pacientes a Excel:', error);
        alert('Error al exportar pacientes a Excel');
        return false;
    }
}

// Exportar pacientes a PDF profesional
async function exportarPacientesPDF(pacientes) {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape para más espacio

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let y = margin;

        // Título
        pdf.setFillColor(243, 156, 18);
        pdf.rect(0, 0, pageWidth, 35, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont(undefined, 'bold');
        pdf.text('LABORATORIO CLINICO PEREZ', pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(14);
        pdf.text('Reporte de Pacientes', pageWidth / 2, 25, { align: 'center' });

        y = 45;

        // Fecha
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(10);
        pdf.text('Fecha: ' + new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }), margin, y);
        pdf.text('Total: ' + pacientes.length + ' pacientes', pageWidth - margin - 50, y);
        y += 10;

        // Tabla de encabezados
        const colWidths = [10, 55, 25, 30, 55, 35, 25];
        const headers = ['#', 'NOMBRE', 'CI', 'TELEFONO', 'EMAIL', 'FECHA REG.', 'ESTADO'];

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
        pdf.setTextColor(50, 50, 50);
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);

        pacientes.forEach((p, i) => {
            if (y > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage();
                y = margin;
            }

            // Fila alternada
            if (i % 2 === 0) {
                pdf.setFillColor(248, 249, 250);
                pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
            }

            x = margin + 2;
            const row = [
                (i + 1).toString(),
                (p.nombre || 'N/A').substring(0, 30),
                p.ci || 'N/A',
                p.telefono || 'N/A',
                (p.email || 'N/A').substring(0, 35),
                p.fecha_registro || 'N/A',
                p.activo !== false ? 'Activo' : 'Inactivo'
            ];

            row.forEach((val, j) => {
                pdf.text(val, x, y);
                x += colWidths[j];
            });
            y += 8;
        });

        // Pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('Generado por Sistema Lab Perez - ' + new Date().toLocaleString(), pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

        pdf.save(`Pacientes_${new Date().toISOString().split('T')[0]}.pdf`);
        return true;
    } catch (error) {
        console.error('Error exportando pacientes a PDF:', error);
        alert('Error al exportar pacientes a PDF');
        return false;
    }
}
