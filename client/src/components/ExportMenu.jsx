import React, { useState } from 'react';
import { FiDownload, FiShare2, FiFileText, FiCode } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportMenu = ({ analysis, reportId }) => {
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const element = document.getElementById('analysis-report-content');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('resume-analysis-report.pdf');
        } catch (err) {
            console.error('PDF Export failed:', err);
            alert('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    const handleExportJSON = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(analysis, null, 2)
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'resume-analysis.json';
        link.click();
    };

    const handleShareLink = () => {
        if (!reportId) {
            alert('Please save the report first to generate a shareable link.');
            return;
        }
        const url = `${window.location.origin}/report/${reportId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                title="Export as PDF"
            >
                <FiFileText /> {exporting ? 'Generating...' : 'PDF'}
            </button>
            <button
                onClick={handleExportJSON}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                title="Export as JSON"
            >
                <FiCode /> JSON
            </button>
            <button
                onClick={handleShareLink}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
                title="Copy Share Link"
            >
                <FiShare2 /> {copied ? 'Copied!' : 'Share'}
            </button>
        </div>
    );
};

export default ExportMenu;
