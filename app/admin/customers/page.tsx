'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Mail, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/ui/export-button';
import { exportAllData } from '@/lib/export';

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
  orders?: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchCustomers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.limit]);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/admin/customers?${params}`);
      if (response.ok) {
        const data = await response.json();
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setCustomers(data);
          setPagination(prev => ({
            ...prev,
            total: data.length,
            pages: Math.ceil(data.length / prev.limit),
          }));
        } else if (data.customers && Array.isArray(data.customers)) {
          setCustomers(data.customers);
          setPagination(prev => ({
            ...prev,
            total: data.pagination?.total || data.customers.length,
            pages: data.pagination?.pages || Math.ceil(data.customers.length / prev.limit),
          }));
        } else {
          setCustomers([]);
          setPagination(prev => ({ ...prev, total: 0, pages: 0 }));
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalSpent = (orders: Customer['orders']) => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.reduce((total, order) => total + order.total, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <ExportButton 
          data={customers}
          formatData={() => ({
            headers: ['Name', 'Email', 'Orders', 'Total Spent', 'Joined'],
            rows: customers.map(customer => [
              customer.name || 'No name',
              customer.email,
              customer._count.orders.toString(),
              `$${calculateTotalSpent(customer.orders).toFixed(2)}`,
              new Date(customer.createdAt).toLocaleDateString()
            ]),
            filename: `customers-${new Date().toISOString().split('T')[0]}`
          })}
          loading={loading}
          exportAll={true}
          exportType="customers"
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {customer.name?.charAt(0).toUpperCase() || customer.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {customer._count.orders} orders
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ${calculateTotalSpent(customer.orders).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {customers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex flex-col items-center space-y-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                {(() => {
                  const currentPage = pagination.page;
                  const totalPages = pagination.pages;
                  const maxVisible = 3;
                  
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                  
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }
                  
                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  
                  return (
                    <>
                      {startPage > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </Button>
                          {startPage > 2 && <span className="text-gray-500">...</span>}
                        </>
                      )}
                      
                      {pages.map(pageNum => (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      
                      {endPage < totalPages && (
                        <>
                          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </>
                  );
                })()}
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span>Items per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.name || selectedCustomer?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Name:</span>
                      <span>{selectedCustomer.name || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Statistics</h3>
                  <div className="space-y-2">
                    <p><strong>Total Orders:</strong> {selectedCustomer._count.orders}</p>
                    <p><strong>Total Spent:</strong> ${calculateTotalSpent(selectedCustomer.orders).toFixed(2)}</p>
                    <p><strong>Average Order:</strong> ${selectedCustomer._count.orders > 0 ? (calculateTotalSpent(selectedCustomer.orders) / selectedCustomer._count.orders).toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-semibold mb-4">Order History</h3>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No orders yet</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}