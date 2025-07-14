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
          disabled={loading} 
          className="hover:scale-105 transition-transform duration-300 border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-200"
        >
          variant="outline" 
          disabled={loading || data.length === 0}
          className="hover:scale-105 transition-transform duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          disabled={exporting === 'csv'}
          className="flex items-center cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>{exporting === 'csv' ? 'Exporting...' : 'Export as CSV'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          disabled={exporting === 'pdf'}
          className="flex items-center cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          <span>{exporting === 'pdf' ? 'Exporting...' : 'Export as PDF'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}