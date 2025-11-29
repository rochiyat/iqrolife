import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all menu items or by role
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = `
      SELECT id, name, label, icon, href, parent_id, order_index, is_active, roles, created_at, updated_at
      FROM menu
      WHERE is_active = true
    `;
    const params: any[] = [];

    // Filter by role if provided
    if (role) {
      query += ` AND roles @> $1::jsonb`;
      params.push(JSON.stringify([role]));
    }

    query += ` ORDER BY order_index, name`;

    const result = await pool.query(query, params);

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

// PUT - Update menu item (supports batch update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a batch update (array of menus)
    if (Array.isArray(body)) {
      // Batch update
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const results = [];
        for (const menu of body) {
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
          } = menu;

          if (!id) {
            throw new Error(`ID is required for menu: ${JSON.stringify(menu)}`);
          }

          // Build dynamic update query
          const updates: string[] = [];
          const params: any[] = [];
          let paramIndex = 1;

          if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            params.push(name);
          }
          if (label !== undefined) {
            updates.push(`label = $${paramIndex++}`);
            params.push(label);
          }
          if (icon !== undefined) {
            updates.push(`icon = $${paramIndex++}`);
            params.push(icon);
          }
          if (href !== undefined) {
            updates.push(`href = $${paramIndex++}`);
            params.push(href);
          }
          if (parent_id !== undefined) {
            updates.push(`parent_id = $${paramIndex++}`);
            params.push(parent_id);
          }
          if (order_index !== undefined) {
            updates.push(`order_index = $${paramIndex++}`);
            params.push(order_index);
          }
          if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            params.push(is_active);
          }
          if (roles !== undefined) {
            updates.push(`roles = $${paramIndex++}`);
            params.push(JSON.stringify(roles));
          }

          if (updates.length === 0) {
            continue; // Skip if no updates
          }

          updates.push('updated_at = NOW()');
          params.push(id);

          const query = `
            UPDATE menu 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, name, label, icon, href, parent_id, order_index, is_active, roles, updated_at
          `;

          const result = await client.query(query, params);

          if (result.rows.length === 0) {
            throw new Error(`Menu with id ${id} not found`);
          }

          results.push(result.rows[0]);
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: `${results.length} menu berhasil diupdate`,
          data: results,
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } else {
      // Single update
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
      } = body;

      if (!id) {
        return NextResponse.json(
          { error: 'ID menu diperlukan' },
          { status: 400 }
        );
      }

      // Build dynamic update query
      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        params.push(name);
      }
      if (label !== undefined) {
        updates.push(`label = $${paramIndex++}`);
        params.push(label);
      }
      if (icon !== undefined) {
        updates.push(`icon = $${paramIndex++}`);
        params.push(icon);
      }
      if (href !== undefined) {
        updates.push(`href = $${paramIndex++}`);
        params.push(href);
      }
      if (parent_id !== undefined) {
        updates.push(`parent_id = $${paramIndex++}`);
        params.push(parent_id);
      }
      if (order_index !== undefined) {
        updates.push(`order_index = $${paramIndex++}`);
        params.push(order_index);
      }
      if (is_active !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        params.push(is_active);
      }
      if (roles !== undefined) {
        updates.push(`roles = $${paramIndex++}`);
        params.push(JSON.stringify(roles));
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { error: 'Tidak ada field yang akan diupdate' },
          { status: 400 }
        );
      }

      updates.push('updated_at = NOW()');
      params.push(id);

      const query = `
        UPDATE menu 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, name, label, icon, href, parent_id, order_index, is_active, roles, updated_at
      `;

      const result = await pool.query(query, params);

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
    }
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      {
        error: 'Gagal mengupdate menu',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
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
