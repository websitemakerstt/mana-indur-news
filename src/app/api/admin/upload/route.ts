import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/auth';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Basic file validation
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'File must be an image' }, { status: 400 });
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ message: 'File must be less than 5MB' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // sanitize filename
    const filename = `images/${uniqueSuffix}-${originalName}`;

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      // Cloudflare R2 doesn't use ACLs in the same way as S3, 
      // public access is typically managed via bucket policies or custom domains.
    });

    await s3Client.send(command);

    // Construct the public URL
    // Ensure NEXT_PUBLIC_R2_PUBLIC_URL does not have a trailing slash
    const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, '') || '';
    const publicUrl = `${publicBaseUrl}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
