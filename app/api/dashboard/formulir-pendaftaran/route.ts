import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Fetch all formulir pendaftaran
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    // If ID is provided, fetch single record
    if (id) {
      const result = await pool.query(
        `SELECT * FROM formulir_pendaftaran WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Formulir tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
      });
    }

    // Fetch all records
    let query = `
      SELECT * FROM formulir_pendaftaran
      ORDER BY submission_date DESC
    `;

    const params: any[] = [];

    if (status) {
      query = `
        SELECT * FROM formulir_pendaftaran
        WHERE status = $1
        ORDER BY submission_date DESC
      `;
      params.push(status);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Fetch formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data formulir' },
      { status: 500 }
    );
  }
}

// POST - Create new formulir pendaftaran
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const result = await pool.query(
      `INSERT INTO formulir_pendaftaran (
        user_id, nama_lengkap, nama_panggilan, jenis_kelamin,
        tempat_lahir, tanggal_lahir, agama, kewarganegaraan,
        anak_ke, jumlah_saudara, bahasa_sehari_hari,
        alamat_lengkap, rt, rw, kelurahan, kecamatan,
        kabupaten_kota, provinsi, kode_pos, telepon, jarak_ke_sekolah,
        nama_ayah, pekerjaan_ayah, pendidikan_ayah, telepon_ayah,
        nama_ibu, pekerjaan_ibu, pendidikan_ibu, telepon_ibu,
        nama_wali, hubungan_wali, telepon_wali,
        golongan_darah, riwayat_penyakit, alergi,
        tinggi_badan, berat_badan, riwayat_vaksinasi,
        hobi_minat, prestasi_yang_pernah_diraih,
        program_yang_dipilih, informasi_tambahan, pernyataan_setuju
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43
      ) RETURNING id`,
      [
        data.user_id || null,
        data.nama_lengkap,
        data.nama_panggilan,
        data.jenis_kelamin,
        data.tempat_lahir,
        data.tanggal_lahir,
        data.agama,
        data.kewarganegaraan,
        data.anak_ke,
        data.jumlah_saudara,
        data.bahasa_sehari_hari,
        data.alamat_lengkap,
        data.rt,
        data.rw,
        data.kelurahan,
        data.kecamatan,
        data.kabupaten_kota,
        data.provinsi,
        data.kode_pos,
        data.telepon,
        data.jarak_ke_sekolah || null,
        data.nama_ayah,
        data.pekerjaan_ayah,
        data.pendidikan_ayah || null,
        data.telepon_ayah,
        data.nama_ibu,
        data.pekerjaan_ibu,
        data.pendidikan_ibu || null,
        data.telepon_ibu,
        data.nama_wali || null,
        data.hubungan_wali || null,
        data.telepon_wali || null,
        data.golongan_darah || null,
        data.riwayat_penyakit || null,
        data.alergi || null,
        data.tinggi_badan || null,
        data.berat_badan || null,
        data.riwayat_vaksinasi || null,
        data.hobi_minat || null,
        data.prestasi_yang_pernah_diraih || null,
        data.program_yang_dipilih,
        data.informasi_tambahan || null,
        data.pernyataan_setuju,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Formulir berhasil dikirim',
      data: { id: result.rows[0].id },
    });
  } catch (error) {
    console.error('Create formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan formulir' },
      { status: 500 }
    );
  }
}

// PUT - Update formulir status
export async function PUT(request: NextRequest) {
  try {
    const { id, status, reviewNotes, reviewedBy } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE formulir_pendaftaran 
       SET status = $1, review_notes = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING id, nama_lengkap, status`,
      [status, reviewNotes || null, reviewedBy || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status formulir berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate status formulir' },
      { status: 500 }
    );
  }
}

// DELETE - Delete formulir
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM formulir_pendaftaran WHERE id = $1 RETURNING nama_lengkap',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Formulir tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Formulir berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete formulir pendaftaran error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus formulir' },
      { status: 500 }
    );
  }
}
