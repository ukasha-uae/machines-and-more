import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  if (
    typeof payload.name !== 'string' ||
    typeof payload.slug !== 'string' ||
    typeof payload.description !== 'string' ||
    typeof payload.price !== 'number'
  ) {
    return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 });
  }

  const productData = {
    ...payload,
    status: 'pending',
    featured: false,
    createdAt: new Date().toISOString(),
  };

  const ref = await adminDb.collection('products').add(productData);
  return NextResponse.json({ id: ref.id });
}
