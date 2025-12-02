import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const product = await Product.findById(params.id)
      .select('name description price category images creatorName store id')
      .lean();

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('[API] Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product', error: error.message },
      { status: 500 }
    );
  }
}
