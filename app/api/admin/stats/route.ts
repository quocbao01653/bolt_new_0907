import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current month and last month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch comprehensive stats
    const [
      currentRevenue,
      currentOrders,
      totalCustomers,
      totalProducts,
      lastMonthRevenue,
      lastMonthOrders,
      lastMonthCustomers,
      lowStockCount,
      pendingOrders,
      recentSales,
      topCategories,
      monthlyRevenue,
    ] = await Promise.all([
      // Current month revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: currentMonthStart,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: {
          total: true,
        },
        _count: true,
      }),
      
      // Current month orders count
      prisma.order.count({
        where: {
          createdAt: {
            gte: currentMonthStart,
          },
          status: {
            not: 'CANCELLED',
          },
        },
      }),
      
      // Total customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),

      // Total products
      prisma.product.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      
      // Last month revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: {
          total: true,
        },
      }),
      
      // Last month orders count
      prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
          status: {
            not: 'CANCELLED',
          },
        },
      }),

      // Last month customers
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Low stock products
      prisma.product.count({
        where: {
          stock: {
            lte: 10,
          },
          status: 'ACTIVE',
        },
      }),

      // Pending orders
      prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),

      // Recent sales (last 7 days)
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Top categories by sales
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),

      // Monthly revenue for the last 6 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("total") as revenue,
          COUNT(*) as orders
        FROM "orders" 
        WHERE "createdAt" >= ${new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)}
          AND "status" != 'CANCELLED'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 6
      `,
    ]);

    // Calculate stats
    const totalRevenue = Number(currentRevenue._sum.total) || 0;
    const totalOrders = currentOrders;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const lastMonthRevenueValue = Number(lastMonthRevenue._sum.total) || 0;
    const lastMonthOrdersValue = lastMonthOrders;

    // Calculate percentage changes
    const revenueChange = lastMonthRevenueValue > 0 
      ? ((totalRevenue - lastMonthRevenueValue) / lastMonthRevenueValue) * 100 
      : totalRevenue > 0 ? 100 : 0;
    
    const ordersChange = lastMonthOrdersValue > 0 
      ? ((totalOrders - lastMonthOrdersValue) / lastMonthOrdersValue) * 100 
      : totalOrders > 0 ? 100 : 0;

    const customersChange = lastMonthCustomers > 0 
      ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 
      : totalCustomers > 0 ? 100 : 0;

    const aovChange = lastMonthOrdersValue > 0 && lastMonthRevenueValue > 0
      ? ((averageOrderValue - (lastMonthRevenueValue / lastMonthOrdersValue)) / (lastMonthRevenueValue / lastMonthOrdersValue)) * 100
      : averageOrderValue > 0 ? 100 : 0;

    const stats = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      customersChange: Math.round(customersChange * 10) / 10,
      aovChange: Math.round(aovChange * 10) / 10,
      lowStockCount,
      pendingOrders,
      recentSales: Number(recentSales._sum.total) || 0,
      monthlyRevenue: (monthlyRevenue as any[]).map(item => ({
        month: item.month,
        revenue: Number(item.revenue),
        orders: Number(item.orders),
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    // Return fallback stats
    const fallbackStats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      averageOrderValue: 0,
      revenueChange: 0,
      ordersChange: 0,
      customersChange: 0,
      aovChange: 0,
      lowStockCount: 0,
      pendingOrders: 0,
      recentSales: 0,
      monthlyRevenue: [],
    };
    
    return NextResponse.json(fallbackStats);
  }
}