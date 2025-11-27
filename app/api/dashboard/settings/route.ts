import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all settings or by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    let query = `
      SELECT id, key, value, type, category, description, is_public, created_at, updated_at
      FROM settings
      ORDER BY category, key
    `;

    const params: any[] = [];

    if (key) {
      query = `
        SELECT id, key, value, type, category, description, is_public, created_at, updated_at
        FROM settings
        WHERE key = $1
      `;
      params.push(key);
    } else if (category) {
      query = `
        SELECT id, key, value, type, category, description, is_public, created_at, updated_at
        FROM settings
        WHERE category = $1
        ORDER BY key
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
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data settings' },
      { status: 500 }
    );
  }
}

// POST - Create new setting
export async function POST(request: NextRequest) {
  try {
    const { key, value, type, category, description, is_public } =
      await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Key wajib diisi' }, { status: 400 });
    }

    // Check if key already exists
    const existing = await pool.query(
      'SELECT id FROM settings WHERE key = $1',
      [key]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Setting dengan key ini sudah ada' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO settings (key, value, type, category, description, is_public, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, key, value, type, category, description, is_public, created_at`,
      [
        key,
        value || null,
        type || 'string',
        category || null,
        description || null,
        is_public || false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Setting berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan setting' },
      { status: 500 }
    );
  }
}

// PUT - Update setting
export async function PUT(request: NextRequest) {
  try {
    const { id, key, value, type, category, description, is_public } =
      await request.json();

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID atau key setting diperlukan' },
        { status: 400 }
      );
    }

    let query;
    let params;

    if (id) {
      query = `UPDATE settings 
               SET key = COALESCE($1, key),
                   value = COALESCE($2, value),
                   type = COALESCE($3, type),
                   category = COALESCE($4, category),
                   description = COALESCE($5, description),
                   is_public = COALESCE($6, is_public),
                   updated_at = NOW()
               WHERE id = $7
               RETURNING id, key, value, type, category, description, is_public, updated_at`;
      params = [key, value, type, category, description, is_public, id];
    } else {
      query = `UPDATE settings 
               SET value = COALESCE($1, value),
                   type = COALESCE($2, type),
                   category = COALESCE($3, category),
                   description = COALESCE($4, description),
                   is_public = COALESCE($5, is_public),
                   updated_at = NOW()
               WHERE key = $6
               RETURNING id, key, value, type, category, description, is_public, updated_at`;
      params = [value, type, category, description, is_public, key];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Setting tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate setting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id && !key) {
      return NextResponse.json(
        { error: 'ID atau key setting diperlukan' },
        { status: 400 }
      );
    }

    if (id) {
      await pool.query('DELETE FROM settings WHERE id = $1', [id]);
    } else {
      await pool.query('DELETE FROM settings WHERE key = $1', [key]);
    }

    return NextResponse.json({
      success: true,
      message: 'Setting berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus setting' },
      { status: 500 }
    );
  }
}
