'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportToCSV, exportAllData } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  data: any[];
  formatData: (data: any[]) => any;
  loading: boolean;
  exportAll?: boolean;
  exportType?: 'products' | 'customers' | 'orders';
}

export default function ExportButton({ 
  data, 
  formatData, 
  loading, 
  exportAll = false,
  exportType = 'products'
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (loading) return;
    
    setExporting(true);
    try {
      let exportData;
      
      if (exportAll) {
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
            exportData = formatData(data);
        }
      } else {
        // Export current page data
        exportData = formatData(data);
      }
      
      exportToCSV(exportData);
      
      toast({
        title: "Export successful",
        description: `${exportAll ? 'All' : 'Current page'} data exported to CSV file.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
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
    </div>
  );
}