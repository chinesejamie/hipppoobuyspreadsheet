import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    const categories = await Product.distinct('category', { hidden: { $ne: true } });

    return NextResponse.json({
      categories: ['all', ...categories.filter(Boolean).sort()]
    });
  } catch (error) {
    console.error("[API] Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories", categories: ['all'] },
      { status: 500 }
    );
  }
}
