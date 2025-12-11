/**
 * export-estadisticas.js
 * Funciones para exportar estadísticas con gráficos a PDF y Excel
 */

// Exportar estadísticas a Excel
async function exportarEstadisticasExcel(stats) {
    try {
        const wb = XLSX.utils.book_new();

        // Hoja 1: Resumen General
        const resumenData = [
            ['LABORATORIO CLINICO PEREZ'],
            ['REPORTE DE ESTADISTICAS'],
            ['Fecha: ' + new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })],
            [],
            ['INDICADOR', 'VALOR ACTUAL', 'ESTE MES', 'TENDENCIA'],
            ['Total Pacientes', stats.totalPacientes || 0, stats.pacientesEsteMes || 0, stats.pacientesEsteMes > 0 ? 'Crecimiento' : 'Estable'],
            ['Total Resultados', stats.totalResultados || 0, stats.resultadosEsteMes || 0, stats.resultadosEsteMes > 0 ? 'Crecimiento' : 'Estable'],
            ['Pruebas Disponibles', stats.totalPruebas || 0, '-', 'Catalogo'],
            ['Actividad Mensual', (stats.pacientesEsteMes || 0) + (stats.resultadosEsteMes || 0), '-', 'En Progreso'],
            [],
            ['ANALISIS DE TENDENCIAS'],
            [],
            ['Promedio Pacientes/Mes', Math.round(stats.totalPacientes / 12) || 0],
            ['Promedio Resultados/Mes', Math.round(stats.totalResultados / 12) || 0],
            ['Ratio Resultados/Paciente', stats.totalPacientes ? (stats.totalResultados / stats.totalPacientes).toFixed(2) : 0]
        ];

        const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
        wsResumen['!cols'] = [
            { width: 30 },
            { width: 18 },
            { width: 18 },
            { width: 18 }
        ];
        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

        // Hoja 2: Datos por Mes (si disponible)
        if (stats.datosMensuales && stats.datosMensuales.length > 0) {
            const mensualData = [
                ['DATOS MENSUALES DEL AÑO'],
                [],
                ['MES', 'PACIENTES', 'RESULTADOS', 'TOTAL ACTIVIDAD']
            ];

            stats.datosMensuales.forEach(m => {
                mensualData.push([
                    m.mes || 'N/A',
                    m.pacientes || 0,
                    m.resultados || 0,
                    (m.pacientes || 0) + (m.resultados || 0)
                ]);
            });

            const wsMensual = XLSX.utils.aoa_to_sheet(mensualData);
            wsMensual['!cols'] = [
                { width: 20 },
                { width: 15 },
                { width: 15 },
                { width: 18 }
            ];
            XLSX.utils.book_append_sheet(wb, wsMensual, 'Datos Mensuales');
        }

        // Hoja 3: Top Pruebas
        if (stats.topPruebas && stats.topPruebas.length > 0) {
            const pruebasData = [
                ['TOP PRUEBAS MAS SOLICITADAS'],
                [],
                ['#', 'PRUEBA', 'CANTIDAD', 'PRECIO']
            ];

            stats.topPruebas.forEach((p, i) => {
                pruebasData.push([
                    i + 1,
                    p.nombre || 'N/A',
                    p.cantidad || 0,
                    p.precio ? 'Bs. ' + parseFloat(p.precio).toFixed(2) : 'N/A'
                ]);
            });

            const wsPruebas = XLSX.utils.aoa_to_sheet(pruebasData);
            wsPruebas['!cols'] = [
                { width: 5 },
                { width: 45 },
                { width: 12 },
                { width: 15 }
            ];
            XLSX.utils.book_append_sheet(wb, wsPruebas, 'Top Pruebas');
        }

        XLSX.writeFile(wb, `Estadisticas_${new Date().toISOString().split('T')[0]}.xlsx`);
        return true;
    } catch (error) {
        console.error('Error exportando estadísticas a Excel:', error);
        alert('Error al exportar estadísticas a Excel');
        return false;
    }
}

// Exportar estadísticas a PDF con gráficos
async function exportarEstadisticasPDF(stats, chartElements = {}) {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let y = margin;

        // Header
        pdf.setFillColor(243, 156, 18);
        pdf.rect(0, 0, pageWidth, 35, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont(undefined, 'bold');
        pdf.text('LABORATORIO CLINICO PEREZ', pageWidth / 2, 15, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text('Reporte de Estadisticas y Tendencias', pageWidth / 2, 27, { align: 'center' });

        y = 45;

        // Fecha
        pdf.setTextColor(100);
        pdf.setFontSize(10);
        pdf.text('Generado: ' + new Date().toLocaleString('es-BO'), margin, y);
        y += 12;

        // Tarjetas de estadísticas
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(44, 62, 80);
        pdf.text('INDICADORES PRINCIPALES', margin, y);
        y += 8;

        const cardWidth = (pageWidth - margin * 2 - 15) / 4;
        const cardHeight = 25;
        const cardColors = [
            [26, 188, 156],   // Verde
            [243, 156, 18],   // Naranja
            [52, 152, 219],   // Azul
            [155, 89, 182]    // Morado
        ];
        const cardData = [
            { label: 'Pacientes', value: stats.totalPacientes || 0, sub: '+' + (stats.pacientesEsteMes || 0) + ' este mes' },
            { label: 'Resultados', value: stats.totalResultados || 0, sub: '+' + (stats.resultadosEsteMes || 0) + ' este mes' },
            { label: 'Pruebas', value: stats.totalPruebas || 0, sub: 'Disponibles' },
            { label: 'Actividad', value: (stats.pacientesEsteMes || 0) + (stats.resultadosEsteMes || 0), sub: 'Este Mes' }
        ];

        cardData.forEach((card, i) => {
            const x = margin + (cardWidth + 5) * i;

            pdf.setFillColor(...cardColors[i]);
            pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(18);
            pdf.setFont(undefined, 'bold');
            pdf.text(card.value.toString(), x + cardWidth / 2, y + 12, { align: 'center' });

            pdf.setFontSize(8);
            pdf.setFont(undefined, 'normal');
            pdf.text(card.label, x + cardWidth / 2, y + 18, { align: 'center' });
            pdf.text(card.sub, x + cardWidth / 2, y + 23, { align: 'center' });
        });

        y += cardHeight + 15;

        // Capturar gráfico de tendencia si existe
        if (chartElements.trendChart) {
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(44, 62, 80);
            pdf.text('TENDENCIA MENSUAL', margin, y);
            y += 5;

            try {
                const trendImage = chartElements.trendChart.toDataURL('image/png');
                const imgWidth = pageWidth - margin * 2;
                const imgHeight = 60;
                pdf.addImage(trendImage, 'PNG', margin, y, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (e) {
                console.log('No se pudo capturar gráfico de tendencia');
                y += 5;
            }
        }

        // Capturar gráfico de distribución si existe
        if (chartElements.distChart && y < pageHeight - 80) {
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(44, 62, 80);
            pdf.text('DISTRIBUCION GENERAL', margin, y);
            y += 5;

            try {
                const distImage = chartElements.distChart.toDataURL('image/png');
                const imgWidth = 80;
                const imgHeight = 60;
                pdf.addImage(distImage, 'PNG', margin, y, imgWidth, imgHeight);
            } catch (e) {
                console.log('No se pudo capturar gráfico de distribución');
            }
        }

        // Nueva página para tabla de análisis
        pdf.addPage();
        y = margin;

        pdf.setFillColor(44, 62, 80);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        pdf.setTextColor(255);
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('ANALISIS DETALLADO', pageWidth / 2, 13, { align: 'center' });
        y = 30;

        // Tabla de análisis
        pdf.setFontSize(10);
        pdf.setTextColor(44, 62, 80);
        pdf.setFont(undefined, 'bold');
        pdf.text('Metricas Calculadas:', margin, y);
        y += 8;

        const metricas = [
            ['Promedio Pacientes por Mes', Math.round((stats.totalPacientes || 0) / 12).toString()],
            ['Promedio Resultados por Mes', Math.round((stats.totalResultados || 0) / 12).toString()],
            ['Ratio Resultados/Paciente', stats.totalPacientes ? ((stats.totalResultados || 0) / stats.totalPacientes).toFixed(2) : '0'],
            ['Crecimiento Pacientes', (stats.pacientesEsteMes || 0) > 0 ? 'Positivo (+' + stats.pacientesEsteMes + ')' : 'Estable'],
            ['Crecimiento Resultados', (stats.resultadosEsteMes || 0) > 0 ? 'Positivo (+' + stats.resultadosEsteMes + ')' : 'Estable']
        ];

        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(9);
        metricas.forEach((m, i) => {
            if (i % 2 === 0) {
                pdf.setFillColor(248, 249, 250);
                pdf.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
            }
            pdf.setTextColor(70);
            pdf.text(m[0], margin + 5, y);
            pdf.setFont(undefined, 'bold');
            pdf.text(m[1], pageWidth - margin - 30, y);
            pdf.setFont(undefined, 'normal');
            y += 8;
        });

        // Pie
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('Sistema Lab Perez - Reporte generado: ' + new Date().toLocaleString(), pageWidth / 2, pageHeight - 10, { align: 'center' });

        pdf.save(`Estadisticas_${new Date().toISOString().split('T')[0]}.pdf`);
        return true;
    } catch (error) {
        console.error('Error exportando estadísticas a PDF:', error);
        alert('Error al exportar estadísticas a PDF');
        return false;
    }
}
