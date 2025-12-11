/**
 * export-resultados.js
 * Funciones para exportar historial de resultados a PDF y Excel
 * Incluye filtro por paciente
 */

// Exportar resultados a Excel
async function exportarResultadosExcel(resultados, pacienteSeleccionado = null) {
    try {
        const wb = XLSX.utils.book_new();

        // Filtrar si hay paciente seleccionado
        let datos = resultados;
        let titulo = 'HISTORIAL COMPLETO DE RESULTADOS';
        if (pacienteSeleccionado) {
            datos = resultados.filter(r => r.paciente_id == pacienteSeleccionado.id);
            titulo = 'RESULTADOS DE: ' + pacienteSeleccionado.nombre;
        }

        const data = [
            ['LABORATORIO CLINICO PEREZ'],
            [titulo],
            ['Fecha de Generacion: ' + new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })],
            ['Incluye registros eliminados: SI'],
            [],
            ['#', 'PACIENTE', 'CI', 'PRUEBA', 'RESULTADO', 'FECHA', 'ESTADO', 'OBSERVACIONES']
        ];

        datos.forEach((r, i) => {
            data.push([
                i + 1,
                r.paciente_nombre || 'N/A',
                r.paciente_ci || 'N/A',
                r.prueba_nombre || 'N/A',
                r.valor || 'Pendiente',
                r.fecha || 'N/A',
                r.eliminado ? 'ELIMINADO' : (r.estado || 'Activo'),
                r.observaciones || ''
            ]);
        });

        data.push([]);
        data.push(['TOTAL REGISTROS:', datos.length]);
        if (pacienteSeleccionado) {
            data.push(['PACIENTE FILTRADO:', pacienteSeleccionado.nombre]);
        }

        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!cols'] = [
            { width: 5 },   // #
            { width: 30 },  // Paciente
            { width: 15 },  // CI
            { width: 35 },  // Prueba
            { width: 20 },  // Resultado
            { width: 18 },  // Fecha
            { width: 12 },  // Estado
            { width: 35 }   // Observaciones
        ];

        const sheetName = pacienteSeleccionado ? 'Resultados Paciente' : 'Historial Completo';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        const filename = pacienteSeleccionado
            ? `Resultados_${pacienteSeleccionado.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
            : `Historial_Resultados_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, filename);
        return true;
    } catch (error) {
        console.error('Error exportando resultados a Excel:', error);
        alert('Error al exportar resultados a Excel');
        return false;
    }
}

// Exportar resultados a PDF
async function exportarResultadosPDF(resultados, pacienteSeleccionado = null) {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape

        // Filtrar si hay paciente
        let datos = resultados;
        let titulo = 'Historial Completo de Resultados';
        if (pacienteSeleccionado) {
            datos = resultados.filter(r => r.paciente_id == pacienteSeleccionado.id);
            titulo = 'Resultados de: ' + pacienteSeleccionado.nombre;
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        let y = margin;

        // Header
        pdf.setFillColor(243, 156, 18);
        pdf.rect(0, 0, pageWidth, 30, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text('LABORATORIO CLINICO PEREZ', pageWidth / 2, 12, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text(titulo, pageWidth / 2, 22, { align: 'center' });

        y = 38;

        pdf.setTextColor(100);
        pdf.setFontSize(9);
        pdf.text('Fecha: ' + new Date().toLocaleDateString('es-BO'), margin, y);
        pdf.text('Total: ' + datos.length + ' registros', pageWidth - margin - 40, y);
        pdf.text('* Incluye registros eliminados', pageWidth / 2 - 25, y);
        y += 8;

        // Tabla
        const colWidths = [8, 40, 20, 50, 30, 25, 20, 60];
        const headers = ['#', 'PACIENTE', 'CI', 'PRUEBA', 'RESULTADO', 'FECHA', 'ESTADO', 'OBSERVACIONES'];

        pdf.setFillColor(44, 62, 80);
        pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F');

        pdf.setTextColor(255);
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');

        let x = margin + 1;
        headers.forEach((h, i) => {
            pdf.text(h, x, y + 5.5);
            x += colWidths[i];
        });
        y += 10;

        // Datos
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(7);

        datos.forEach((r, i) => {
            if (y > pdf.internal.pageSize.getHeight() - 15) {
                pdf.addPage();
                y = margin;
            }

            // Color de fondo segun estado
            if (r.eliminado) {
                pdf.setFillColor(255, 235, 235);
            } else if (i % 2 === 0) {
                pdf.setFillColor(248, 249, 250);
            } else {
                pdf.setFillColor(255, 255, 255);
            }
            pdf.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F');

            pdf.setTextColor(r.eliminado ? 150 : 50);
            x = margin + 1;

            const row = [
                (i + 1).toString(),
                (r.paciente_nombre || 'N/A').substring(0, 22),
                (r.paciente_ci || 'N/A').substring(0, 12),
                (r.prueba_nombre || 'N/A').substring(0, 30),
                (r.valor || 'Pendiente').substring(0, 18),
                r.fecha || 'N/A',
                r.eliminado ? 'ELIM.' : (r.estado || 'Activo').substring(0, 10),
                (r.observaciones || '').substring(0, 40)
            ];

            row.forEach((val, j) => {
                pdf.text(val, x, y);
                x += colWidths[j];
            });
            y += 7;
        });

        // Pie
        pdf.setFontSize(7);
        pdf.setTextColor(150);
        pdf.text('Sistema Lab Perez - ' + new Date().toLocaleString(), pageWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });

        const filename = pacienteSeleccionado
            ? `Resultados_${pacienteSeleccionado.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
            : `Historial_Resultados_${new Date().toISOString().split('T')[0]}.pdf`;

        pdf.save(filename);
        return true;
    } catch (error) {
        console.error('Error exportando resultados a PDF:', error);
        alert('Error al exportar resultados a PDF');
        return false;
    }
}
