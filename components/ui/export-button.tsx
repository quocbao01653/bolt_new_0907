'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data: any[];
  formatData: (data: any[]) => {
    headers: string[];
    rows: (string | number)[][];
    title: string;
    filename: string;
  };
  loading?: boolean;
}

export default function ExportButton({ data, formatData, loading = false }: ExportButtonProps) {
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const { toast } = useToast();

  const exportToCSV = (exportData: ReturnType<typeof formatData>) => {
    const csvContent = [
      exportData.headers.join(','),
      ...exportData.rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportData.filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async (exportData: ReturnType<typeof formatData>) => {
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(exportData.title, 14, 22);
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
      
      // Add table
      (doc as any).autoTable({
        head: [exportData.headers],
        body: exportData.rows,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });
      
      doc.save(`${exportData.filename}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: "PDF Export Failed",
        description: "Falling back to CSV export. Please try again.",
        variant: "destructive",
      });
      // Fallback to CSV export
      exportToCSV(exportData);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (loading || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    setExporting(format);
    
    try {
      const exportData = formatData(data);
      
      if (format === 'csv') {
        exportToCSV(exportData);
        toast({
          title: "Export Successful",
          description: "CSV file has been downloaded.",
        });
      } else {
        await exportToPDF(exportData);
        toast({
          title: "Export Successful",
          description: "PDF file has been downloaded.",
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={loading || data.length === 0}
          className="flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-200"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          disabled={exporting !== null}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        >
          <FileSpreadsheet className="w-4 h-4 text-green-600" />
          <span>Export as CSV</span>
          {exporting === 'csv' && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        >
          <FileText className="w-4 h-4 text-red-600" />
          <span>Export as PDF</span>
          {exporting === 'pdf' && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}