import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  
  if (body.category_id === '') {
    body.category_id = null;
  }
  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert([body])
    .select();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id, ...updates } = await request.json();

  if (updates.category_id === '') {
    updates.category_id = null;
  }
  const { data, error } = await supabaseAdmin
    .from('articles')
    .update(updates)
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
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Deleted successfully' });
}
