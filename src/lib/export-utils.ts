import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportData {
    id: string;
    title: string;
    status: string;
    priority: string;
    created_at: string;
    resident: string;
}

/**
 * Utility to export report data to PDF and Excel.
 */
export const exportReports = {
    toPDF: (data: ReportData[]) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Mantty Host - Reporte de Mantenimiento', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

        // Table
        autoTable(doc, {
            startY: 40,
            head: [['ID', 'Solicitud', 'Estado', 'Prioridad', 'Residente', 'Fecha']],
            body: data.map(item => [
                item.id,
                item.title,
                item.status,
                item.priority,
                item.resident,
                new Date(item.created_at).toLocaleDateString()
            ]),
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241] }, // Mantty Primary
        });

        doc.save(`mantty-report-${Date.now()}.pdf`);
    },

    toExcel: (data: ReportData[]) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
        XLSX.writeFile(workbook, `mantty-report-${Date.now()}.xlsx`);
    }
};
