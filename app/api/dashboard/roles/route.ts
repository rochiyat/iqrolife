import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all roles
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT id, name, display_name, description, permissions, is_active, created_at, updated_at
      FROM roles
      ORDER BY name
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data roles' },
      { status: 500 }
    );
  }
}

// POST - Create new role
export async function POST(request: NextRequest) {
  try {
    const { name, display_name, description, permissions } =
      await request.json();

    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Name dan display name wajib diisi' },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existing = await pool.query('SELECT id FROM roles WHERE name = $1', [
      name,
    ]);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Role dengan name ini sudah ada' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO roles (name, display_name, description, permissions, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, NOW(), NOW())
       RETURNING id, name, display_name, description, permissions, is_active, created_at`,
      [name, display_name, description || null, permissions || {}]
    );

    return NextResponse.json({
      success: true,
      message: 'Role berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan role' },
      { status: 500 }
    );
  }
}

// PUT - Update role (supports batch update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a batch update (array of roles)
    if (Array.isArray(body)) {
      // Batch update
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const results = [];
        for (const role of body) {
          const {
            id,
            name,
            display_name,
            description,
            permissions,
            is_active,
          } = role;

          if (!id) {
            throw new Error(`ID is required for role: ${JSON.stringify(role)}`);
          }

          const result = await client.query(
            `UPDATE roles 
             SET name = COALESCE($1, name),
                 display_name = COALESCE($2, display_name),
                 description = COALESCE($3, description),
                 permissions = COALESCE($4, permissions),
                 is_active = COALESCE($5, is_active),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING id, name, display_name, description, permissions, is_active, updated_at`,
            [name, display_name, description, permissions, is_active, id]
          );

          if (result.rows.length === 0) {
            throw new Error(`Role with id ${id} not found`);
          }

          results.push(result.rows[0]);
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: `${results.length} roles berhasil diupdate`,
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
      const { id, name, display_name, description, permissions, is_active } =
        body;

      if (!id) {
        return NextResponse.json(
          { error: 'ID role diperlukan' },
          { status: 400 }
        );
      }

      const result = await pool.query(
        `UPDATE roles 
         SET name = COALESCE($1, name),
             display_name = COALESCE($2, display_name),
             description = COALESCE($3, description),
             permissions = COALESCE($4, permissions),
             is_active = COALESCE($5, is_active),
             updated_at = NOW()
         WHERE id = $6
         RETURNING id, name, display_name, description, permissions, is_active, updated_at`,
        [name, display_name, description, permissions, is_active, id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Role tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Role berhasil diupdate',
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      {
        error: 'Gagal mengupdate role',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete role
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID role diperlukan' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM roles WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Role berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus role' },
      { status: 500 }
    );
  }
}
