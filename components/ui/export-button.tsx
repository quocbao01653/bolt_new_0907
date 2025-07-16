'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV, exportAllData } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data: any[];
  formatData: (data: any[]) => { headers: string[]; rows: (string | number)[][]; filename: string };
  loading?: boolean;
  exportAll?: boolean;
  exportType?: 'products' | 'customers' | 'orders';
}

export default function ExportButton({ 
  data, 
  formatData, 
  loading = false, 
  exportAll = false,
  exportType 
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (loading || exporting) return;

    setExporting(true);
    try {
      let exportData;

      if (exportAll && exportType) {
        // Export all data by fetching from API
        switch (exportType) {
          case 'products':
            exportData = await exportAllData.products();
            break;
          case 'customers':
            exportData = await exportAllData.customers();
            break;
          case 'orders':
            exportData = await exportAllData.orders();
            break;
          default:
            throw new Error('Invalid export type');
        }
      } else {
        // Export current page data
        exportData = formatData(data);
      }

      if (!exportData || !exportData.headers || !exportData.rows) {
        throw new Error('Invalid export data format');
      }

      exportToCSV({
        headers: exportData.headers,
        rows: exportData.rows,
        filename: exportData.filename,
        title: exportData.title || 'Export'
      });

      toast({
        title: "Success",
        description: `${exportAll ? 'All data' : 'Current page'} exported successfully`,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading || exporting || data.length === 0}
      className="hover:scale-105 transition-transform duration-300"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {exporting ? 'Exporting...' : exportAll ? 'Export All' : 'Export CSV'}
    </Button>
  );
}