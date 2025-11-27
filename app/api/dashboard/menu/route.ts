import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all menu items
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT id, name, label, icon, href, parent_id, order_index, is_active, roles, created_at, updated_at
      FROM menu
      ORDER BY order_index, name
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data menu' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const { name, label, icon, href, parent_id, order_index, roles } =
      await request.json();

    if (!name || !label || !href) {
      return NextResponse.json(
        { error: 'Name, label, dan href wajib diisi' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO menu (name, label, icon, href, parent_id, order_index, is_active, roles, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, $7, NOW(), NOW())
       RETURNING id, name, label, icon, href, parent_id, order_index, is_active, roles, created_at`,
      [
        name,
        label,
        icon || null,
        href,
        parent_id || null,
        order_index || 0,
        roles || [],
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Menu berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan menu' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      name,
      label,
      icon,
      href,
      parent_id,
      order_index,
      is_active,
      roles,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID menu diperlukan' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE menu 
       SET name = COALESCE($1, name),
           label = COALESCE($2, label),
           icon = COALESCE($3, icon),
           href = COALESCE($4, href),
           parent_id = $5,
           order_index = COALESCE($6, order_index),
           is_active = COALESCE($7, is_active),
           roles = COALESCE($8, roles),
           updated_at = NOW()
       WHERE id = $9
       RETURNING id, name, label, icon, href, parent_id, order_index, is_active, roles, updated_at`,
      [name, label, icon, href, parent_id, order_index, is_active, roles, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate menu' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID menu diperlukan' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM menu WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Menu berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus menu' },
      { status: 500 }
    );
  }
}
