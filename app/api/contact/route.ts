import { NextResponse } from 'next/server';

export async function GET() {
  const contact = {
    title: 'Hubungi Kami',
    subtitle: 'Ada pertanyaan? Jangan ragu untuk menghubungi kami',
    office: {
      title: 'Kantor Yayasan',
      address: 'Jl. Raya Bogor No. 123, Kota Bogor',
      phone: '+62 812-3456-7890',
      email: 'info@iqrolife.org',
      whatsapp: '+62 812-3456-7890',
      hours: 'Senin - Jumat: 08.00 - 16.00 WIB',
    },
    social: {
      facebook: 'https://facebook.com/iqrolife',
      instagram: 'https://instagram.com/iqrolife',
      youtube: 'https://youtube.com/@iqrolife',
      twitter: 'https://twitter.com/iqrolife',
    },
    map: {
      latitude: -6.589167,
      longitude: 106.793056,
      zoom: 15,
    },
    form: {
      title: 'Kirim Pesan',
      fields: [
        {
          name: 'name',
          label: 'Nama Lengkap',
          type: 'text',
          placeholder: 'Masukkan nama lengkap',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Masukkan email',
        },
        {
          name: 'phone',
          label: 'No. Handphone',
          type: 'tel',
          placeholder: 'Masukkan no. handphone',
        },
        {
          name: 'subject',
          label: 'Subjek',
          type: 'text',
          placeholder: 'Subjek pesan',
        },
        {
          name: 'message',
          label: 'Pesan',
          type: 'textarea',
          placeholder: 'Tulis pesan Anda',
        },
      ],
    },
  };

  return NextResponse.json(contact);
}
