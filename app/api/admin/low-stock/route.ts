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

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10, // Products with 10 or fewer items in stock
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        stock: true,
        sku: true,
      },
      orderBy: {
        stock: 'asc',
      },
      take: 5,
    });

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}