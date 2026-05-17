import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name, slug } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert([{ name, slug }])
    .select();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id, name, slug } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ name, slug })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Deleted successfully' });
}
