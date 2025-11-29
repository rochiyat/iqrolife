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

// PUT - Update or Insert setting (UPSERT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a batch update (array of settings)
    if (Array.isArray(body)) {
      // Batch UPSERT
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const results = [];
        for (const setting of body) {
          const { key, value, type, category, description, is_public } =
            setting;

          if (!key) {
            throw new Error(
              `Key is required for setting: ${JSON.stringify(setting)}`
            );
          }

          const query = `
            INSERT INTO settings (key, value, type, category, description, is_public, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            ON CONFLICT (key) 
            DO UPDATE SET 
              value = EXCLUDED.value,
              type = EXCLUDED.type,
              category = EXCLUDED.category,
              description = EXCLUDED.description,
              is_public = EXCLUDED.is_public,
              updated_at = NOW()
            RETURNING id, key, value, type, category, description, is_public, created_at, updated_at
          `;

          const result = await client.query(query, [
            key,
            value || null,
            type || 'string',
            category || null,
            description || null,
            is_public || false,
          ]);

          results.push(result.rows[0]);
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: `${results.length} settings berhasil disimpan`,
          data: results,
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } else {
      // Single UPSERT
      const { key, value, type, category, description, is_public } = body;

      if (!key) {
        return NextResponse.json(
          { error: 'Key setting diperlukan' },
          { status: 400 }
        );
      }

      const query = `
        INSERT INTO settings (key, value, type, category, description, is_public, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (key) 
        DO UPDATE SET 
          value = EXCLUDED.value,
          type = EXCLUDED.type,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          is_public = EXCLUDED.is_public,
          updated_at = NOW()
        RETURNING id, key, value, type, category, description, is_public, created_at, updated_at
      `;

      const result = await pool.query(query, [
        key,
        value || null,
        type || 'string',
        category || null,
        description || null,
        is_public || false,
      ]);

      return NextResponse.json({
        success: true,
        message: 'Setting berhasil disimpan',
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.error('Error upserting setting:', error);
    return NextResponse.json(
      {
        error: 'Gagal menyimpan setting',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
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
