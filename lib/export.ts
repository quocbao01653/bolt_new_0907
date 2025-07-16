// Export utilities for admin dashboard
export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title: string;
  filename: string;
}

export const exportToCSV = (data: ExportData) => {
  if (typeof window === 'undefined') return;
  
  // Create CSV content with bold headers (using UTF-8 BOM for Excel compatibility)
  const BOM = '\uFEFF';
  const csvContent = BOM + [
    // Headers - we'll make them bold by wrapping in quotes and using proper formatting
    data.headers.map(header => `"${header}"`).join(','),
    ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Enhanced export functions that fetch ALL data
export const exportAllData = {
  products: async () => {
    try {
      let allProducts: any[] = [];
      let page = 1;
      let hasMore = true;
      const limit = 100; // Reasonable batch size
      
      while (hasMore) {
        const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          allProducts = [...allProducts, ...data.products];
          hasMore = data.pagination.page < data.pagination.pages;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      return {
        headers: ['Name', 'SKU', 'Category', 'Price', 'Compare Price', 'Stock', 'Status', 'Featured', 'Average Rating', 'Review Count', 'Created Date'],
        rows: allProducts.map((product: any) => [
          product.name,
          product.sku || 'N/A',
          product.category?.name || 'N/A',
          `$${Number(product.price).toFixed(2)}`,
          product.comparePrice ? `$${Number(product.comparePrice).toFixed(2)}` : 'N/A',
          product.stock,
          product.status,
          product.featured ? 'Yes' : 'No',
          product.averageRating || '0',
          product.reviewCount || '0',
          new Date(product.createdAt).toLocaleDateString()
        ]),
        filename: `all-products-${new Date().toISOString().split('T')[0]}`,
        title: 'All Products Export'
      };
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },
  
  customers: async () => {
    try {
      let allCustomers: any[] = [];
      let page = 1;
      let hasMore = true;
      const limit = 100;
      
      while (hasMore) {
        const response = await fetch(`/api/admin/customers?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.customers && data.customers.length > 0) {
          allCustomers = [...allCustomers, ...data.customers];
          hasMore = data.pagination.page < data.pagination.pages;
          page++;
        } else if (data && Array.isArray(data) && data.length > 0) {
          // Fallback for direct array response
          allCustomers = [...allCustomers, ...data];
          hasMore = data.length === limit;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      return {
        headers: ['Name', 'Email', 'Role', 'Total Orders', 'Total Spent', 'Email Verified', 'Join Date'],
        rows: allCustomers.map((customer: any) => [
          customer.name || 'N/A',
          customer.email,
          customer.role,
          customer._count?.orders || 0,
          `$${(customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0).toFixed(2)}`,
          customer.emailVerified ? 'Yes' : 'No',
          new Date(customer.createdAt).toLocaleDateString()
        ]),
        filename: `all-customers-${new Date().toISOString().split('T')[0]}`,
        title: 'All Customers Export'
      };
    } catch (error) {
      console.error('Error fetching all customers:', error);
      throw error;
    }
  },
  
  orders: async () => {
    try {
      let allOrders: any[] = [];
      let page = 1;
      let hasMore = true;
      const limit = 100;
      
      while (hasMore) {
        const response = await fetch(`/api/admin/orders?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.orders && data.orders.length > 0) {
          allOrders = [...allOrders, ...data.orders];
          hasMore = data.pagination.page < data.pagination.pages;
          page++;
        } else {
          hasMore = false;
        }
      }
      
      return {
        headers: ['Order Number', 'Customer Name', 'Customer Email', 'Items Count', 'Subtotal', 'Tax', 'Shipping', 'Total', 'Status', 'Payment Method', 'Order Date'],
        rows: allOrders.map((order: any) => [
          order.orderNumber,
          order.user?.name || 'N/A',
          order.user?.email || 'N/A',
          order.orderItems?.length || 0,
          `$${Number(order.subtotal || 0).toFixed(2)}`,
          `$${Number(order.tax || 0).toFixed(2)}`,
          `$${Number(order.shipping || 0).toFixed(2)}`,
          `$${Number(order.total).toFixed(2)}`,
          order.status,
          order.paymentMethod || 'N/A',
          new Date(order.createdAt).toLocaleDateString()
        ]),
        filename: `all-orders-${new Date().toISOString().split('T')[0]}`,
        title: 'All Orders Export'
      };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }
};

export const formatDataForExport = {
  products: (products: any[]) => ({
    headers: ['Name', 'SKU', 'Category', 'Price', 'Compare Price', 'Stock', 'Status', 'Featured', 'Average Rating', 'Review Count', 'Created Date'],
    rows: products.map(product => [
      product.name,
      product.sku || 'N/A',
      product.category?.name || 'N/A',
      `$${Number(product.price).toFixed(2)}`,
      product.comparePrice ? `$${Number(product.comparePrice).toFixed(2)}` : 'N/A',
      product.stock,
      product.status,
      product.featured ? 'Yes' : 'No',
      product.averageRating || '0',
      product.reviewCount || '0',
      new Date(product.createdAt).toLocaleDateString()
    ]),
    filename: `products-${new Date().toISOString().split('T')[0]}`
  }),
  
  customers: (customers: any[]) => ({
    headers: ['Name', 'Email', 'Role', 'Total Orders', 'Total Spent', 'Email Verified', 'Join Date'],
    rows: customers.map(customer => [
      customer.name || 'N/A',
      customer.email,
      customer.role,
      customer._count?.orders || 0,
      `$${(customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0).toFixed(2)}`,
      customer.emailVerified ? 'Yes' : 'No',
      new Date(customer.createdAt).toLocaleDateString()
    ]),
    filename: `customers-${new Date().toISOString().split('T')[0]}`
  }),
  
  orders: (orders: any[]) => ({
    headers: ['Order Number', 'Customer Name', 'Customer Email', 'Items Count', 'Subtotal', 'Tax', 'Shipping', 'Total', 'Status', 'Payment Method', 'Order Date'],
    rows: orders.map(order => [
      order.orderNumber,
      order.user?.name || 'N/A',
      order.user?.email || 'N/A',
      order.orderItems?.length || 0,
      `$${Number(order.subtotal || 0).toFixed(2)}`,
      `$${Number(order.tax || 0).toFixed(2)}`,
      `$${Number(order.shipping || 0).toFixed(2)}`,
      `$${Number(order.total).toFixed(2)}`,
      order.status,
      order.paymentMethod || 'N/A',
      new Date(order.createdAt).toLocaleDateString()
    ]),
    filename: `orders-${new Date().toISOString().split('T')[0]}`
  })
};