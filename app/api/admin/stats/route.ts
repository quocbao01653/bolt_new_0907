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

    // Fetch current month stats
    const [
      currentRevenue,
      currentOrders,
      totalCustomers,
      lastMonthRevenue,
      lastMonthOrders,
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
      : 0;
    
    const ordersChange = lastMonthOrdersValue > 0 
      ? ((totalOrders - lastMonthOrdersValue) / lastMonthOrdersValue) * 100 
      : 0;

    // Mock customer change (you can implement proper tracking later)
    const customersChange = 12.5;
    const aovChange = 8.2;

    const stats = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      customersChange,
      aovChange,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    // Return fallback stats
    const fallbackStats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueChange: 0,
      ordersChange: 0,
      customersChange: 0,
      aovChange: 0,
    };
    
    return NextResponse.json(fallbackStats);
  }
}