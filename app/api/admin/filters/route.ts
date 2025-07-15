import { NextRequest, NextResponse } from 'next/server';
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

    // Get filter options for admin dashboard
    const [categories, statuses, roles] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      // Product statuses
      prisma.product.findMany({
        select: {
          status: true,
        },
        distinct: ['status'],
      }),
      // User roles
      prisma.user.findMany({
        select: {
          role: true,
        },
        distinct: ['role'],
      }),
    ]);

    // Get date ranges for orders
    const orderDateRange = await prisma.order.aggregate({
      _min: {
        createdAt: true,
      },
      _max: {
        createdAt: true,
      },
    });

    // Get price ranges for products
    const priceRange = await prisma.product.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return NextResponse.json({
      categories,
      productStatuses: statuses.map(s => s.status),
      userRoles: roles.map(r => r.role),
      dateRange: {
        min: orderDateRange._min.createdAt,
        max: orderDateRange._max.createdAt,
      },
      priceRange: {
        min: Number(priceRange._min.price) || 0,
        max: Number(priceRange._max.price) || 1000,
      },
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}