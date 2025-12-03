import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all portofolio items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = `
      SELECT id, title, description, category, image_url, image_public_id, 
             content, tags, is_published, published_at, created_by, created_at, updated_at
      FROM portofolio
      ORDER BY created_at DESC
    `;

    const params: any[] = [];

    if (category) {
      query = `
        SELECT id, title, description, category, image_url, image_public_id, 
               content, tags, is_published, published_at, created_by, created_at, updated_at
        FROM portofolio
        WHERE category = $1
        ORDER BY created_at DESC
      `;
      params.push(category);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching portofolio:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data portofolio' },
      { status: 500 }
    );
  }
}

// POST - Create new portofolio item
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      category,
      image_url,
      image_public_id,
      content,
      tags,
      is_published,
      created_by,
    } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title wajib diisi' }, { status: 400 });
    }

    const published_at = is_published ? new Date() : null;

    const result = await pool.query(
      `INSERT INTO portofolio (title, description, category, image_url, image_public_id, content, tags, is_published, published_at, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING id, title, description, category, image_url, image_public_id, content, tags, is_published, published_at, created_by, created_at`,
      [
        title,
        description || null,
        category || null,
        image_url || null,
        image_public_id || null,
        content || null,
        tags || [],
        is_published || false,
        published_at,
        created_by || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Portofolio berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating portofolio:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan portofolio' },
      { status: 500 }
    );
  }
}

// PUT - Update portofolio item
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      category,
      image_url,
      image_public_id,
      content,
      tags,
      is_published,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID portofolio diperlukan' },
        { status: 400 }
      );
    }

    // Get current published status
    const current = await pool.query(
      'SELECT is_published FROM portofolio WHERE id = $1',
      [id]
    );

    let published_at = null;
    if (
      is_published &&
      current.rows.length > 0 &&
      !current.rows[0].is_published
    ) {
      // Just published now
      published_at = new Date();
    }

    const result = await pool.query(
      `UPDATE portofolio 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           image_url = COALESCE($4, image_url),
           image_public_id = COALESCE($5, image_public_id),
           content = COALESCE($6, content),
           tags = COALESCE($7, tags),
           is_published = COALESCE($8, is_published),
           published_at = COALESCE($9, published_at),
           updated_at = NOW()
       WHERE id = $10
       RETURNING id, title, description, category, image_url, image_public_id, content, tags, is_published, published_at, updated_at`,
      [
        title,
        description,
        category,
        image_url,
        image_public_id,
        content,
        tags,
        is_published,
        published_at,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Portofolio tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Portofolio berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating portofolio:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate portofolio' },
      { status: 500 }
    );
  }
}

// DELETE - Delete portofolio item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID portofolio diperlukan' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM portofolio WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Portofolio berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting portofolio:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus portofolio' },
      { status: 500 }
    );
  }
}
