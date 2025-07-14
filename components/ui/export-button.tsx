'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToPDF, ExportData } from '@/lib/export';

interface ExportButtonProps {
  data: any[];
  formatData: (data: any[]) => ExportData;
  loading?: boolean;
}

export default function ExportButton({ data, formatData, loading }: ExportButtonProps) {
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(format);
    
    try {
      const exportData = formatData(data);
      
      if (format === 'csv') {
        exportToCSV(exportData);
      } else {
        exportToPDF(exportData);
      }
    } catch (error) {
      console.error('Export failed:', error);
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
          className="hover:scale-105 transition-transform duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2 duration-300">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          disabled={exporting === 'csv'}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>{exporting === 'csv' ? 'Exporting...' : 'Export as CSV'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={exporting === 'pdf'}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          <span>{exporting === 'pdf' ? 'Exporting...' : 'Export as PDF'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}