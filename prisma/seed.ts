import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // ===== SEED ROLES =====
  console.log('\n📋 Creating roles...');
  const roles = [
    {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full access to all features and settings',
    },
    {
      name: 'teacher',
      displayName: 'Teacher',
      description: 'Access to student data and limited dashboard features',
    },
    {
      name: 'staff',
      displayName: 'Staff',
      description: 'Access to student registration and management',
    },
    {
      name: 'parent',
      displayName: 'Parent',
      description: 'Limited access to view their child information',
    },
  ];

  const createdRoles = [];
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: roleData,
      create: roleData,
    });
    createdRoles.push(role);
    console.log(`  ✅ Role: ${role.displayName} (${role.name})`);
  }

  // ===== SEED MENUS =====
  console.log('\n📋 Creating menus...');
  const menus = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      order: 1,
      isActive: true,
    },
    {
      name: 'Calon Murid',
      path: '/dashboard/calon-murid',
      icon: 'UserCheck',
      order: 2,
      isActive: true,
    },
    {
      name: 'Users Management',
      path: '/dashboard/users',
      icon: 'Users',
      order: 3,
      isActive: true,
    },
    {
      name: 'Roles & Permissions',
      path: '/dashboard/roles',
      icon: 'Shield',
      order: 4,
      isActive: true,
    },
  ];

  const createdMenus = [];
  for (const menuData of menus) {
    const menu = await prisma.menu.upsert({
      where: { path: menuData.path },
      update: menuData,
      create: menuData,
    });
    createdMenus.push(menu);
    console.log(`  ✅ Menu: ${menu.name} (${menu.path})`);
  }

  // ===== SEED ROLE-MENU RELATIONSHIPS =====
  console.log('\n📋 Creating role-menu relationships...');
  
  // Find roles
  const adminRole = createdRoles.find(r => r.name === 'admin')!;
  const teacherRole = createdRoles.find(r => r.name === 'teacher')!;
  const staffRole = createdRoles.find(r => r.name === 'staff')!;
  const parentRole = createdRoles.find(r => r.name === 'parent')!;

  // Find menus
  const dashboardMenu = createdMenus.find(m => m.path === '/dashboard')!;
  const calonMuridMenu = createdMenus.find(m => m.path === '/dashboard/calon-murid')!;
  const usersMenu = createdMenus.find(m => m.path === '/dashboard/users')!;
  const rolesMenu = createdMenus.find(m => m.path === '/dashboard/roles')!;

  // Admin: All menus
  const adminMenus = [dashboardMenu, calonMuridMenu, usersMenu, rolesMenu];
  for (const menu of adminMenus) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: adminRole.id,
          menuId: menu.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        menuId: menu.id,
      },
    });
  }
  console.log(`  ✅ Admin: ${adminMenus.length} menus`);

  // Teacher: Dashboard only
  await prisma.roleMenu.upsert({
    where: {
      roleId_menuId: {
        roleId: teacherRole.id,
        menuId: dashboardMenu.id,
      },
    },
    update: {},
    create: {
      roleId: teacherRole.id,
      menuId: dashboardMenu.id,
    },
  });
  console.log(`  ✅ Teacher: 1 menu`);

  // Staff: Dashboard + Calon Murid
  const staffMenus = [dashboardMenu, calonMuridMenu];
  for (const menu of staffMenus) {
    await prisma.roleMenu.upsert({
      where: {
        roleId_menuId: {
          roleId: staffRole.id,
          menuId: menu.id,
        },
      },
      update: {},
      create: {
        roleId: staffRole.id,
        menuId: menu.id,
      },
    });
  }
  console.log(`  ✅ Staff: ${staffMenus.length} menus`);

  // Parent: Dashboard only
  await prisma.roleMenu.upsert({
    where: {
      roleId_menuId: {
        roleId: parentRole.id,
        menuId: dashboardMenu.id,
      },
    },
    update: {},
    create: {
      roleId: parentRole.id,
      menuId: dashboardMenu.id,
    },
  });
  console.log(`  ✅ Parent: 1 menu`);

  // ===== SEED USERS =====
  console.log('\n👤 Creating users...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iqrolife.com' },
    update: {
      roleId: adminRole.id,
      roleName: 'admin',
    },
    create: {
      email: 'admin@iqrolife.com',
      name: 'Admin Iqrolife',
      password: hashedPassword,
      roleId: adminRole.id,
      roleName: 'admin',
    },
  });
  console.log(`  ✅ Admin: ${admin.email} / admin123`);

  const testHashedPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@iqrolife.com' },
    update: {
      roleId: staffRole.id,
      roleName: 'staff',
    },
    create: {
      email: 'test@iqrolife.com',
      name: 'Test Staff',
      password: testHashedPassword,
      roleId: staffRole.id,
      roleName: 'staff',
    },
  });
  console.log(`  ✅ Staff: ${testUser.email} / test123`);

  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@iqrolife.com' },
    update: {
      roleId: teacherRole.id,
      roleName: 'teacher',
    },
    create: {
      email: 'teacher@iqrolife.com',
      name: 'Teacher Iqrolife',
      password: teacherPassword,
      roleId: teacherRole.id,
      roleName: 'teacher',
    },
  });
  console.log(`  ✅ Teacher: ${teacher.email} / teacher123`);

  // ===== SEED DUMMY PROSPECTIVE STUDENTS =====
  console.log('\n🎓 Creating dummy prospective students...');
  
  const dummyStudents = [
    {
      namaLengkap: 'Ahmad Rizki Maulana',
      tanggalLahir: '2019-03-15',
      jenisKelamin: 'Laki-laki',
      asalSekolah: 'TK Melati',
      namaOrangTua: 'Budi Santoso',
      noTelepon: '081234567890',
      email: 'budi.santoso@email.com',
      alamat: 'Jl. Merdeka No. 123, Jakarta Selatan',
      catatan: 'Anak aktif dan suka bermain sepak bola',
      status: 'pending',
    },
    {
      namaLengkap: 'Siti Nurhaliza',
      tanggalLahir: '2019-07-20',
      jenisKelamin: 'Perempuan',
      asalSekolah: null,
      namaOrangTua: 'Dewi Lestari',
      noTelepon: '081234567891',
      email: 'dewi.lestari@email.com',
      alamat: 'Jl. Sudirman No. 456, Jakarta Pusat',
      catatan: 'Anak pendiam, suka menggambar',
      status: 'pending',
    },
    {
      namaLengkap: 'Muhammad Farhan',
      tanggalLahir: '2019-05-10',
      jenisKelamin: 'Laki-laki',
      asalSekolah: 'TK Kasih Ibu',
      namaOrangTua: 'Andi Wijaya',
      noTelepon: '081234567892',
      email: 'andi.wijaya@email.com',
      alamat: 'Jl. Gatot Subroto No. 789, Tangerang',
      catatan: null,
      status: 'approved',
    },
    {
      namaLengkap: 'Zahra Azzahra',
      tanggalLahir: '2019-09-25',
      jenisKelamin: 'Perempuan',
      asalSekolah: 'TK Harapan Bangsa',
      namaOrangTua: 'Siti Aminah',
      noTelepon: '081234567893',
      email: 'siti.aminah@email.com',
      alamat: 'Jl. Ahmad Yani No. 321, Bekasi',
      catatan: 'Sangat ceria dan mudah bergaul',
      status: 'approved',
    },
    {
      namaLengkap: 'Rizky Ramadhan',
      tanggalLahir: '2019-11-05',
      jenisKelamin: 'Laki-laki',
      asalSekolah: null,
      namaOrangTua: 'Hendra Gunawan',
      noTelepon: '081234567894',
      email: 'hendra.gunawan@email.com',
      alamat: 'Jl. Diponegoro No. 654, Bogor',
      catatan: 'Alergi susu sapi',
      status: 'rejected',
    },
    {
      namaLengkap: 'Aisyah Putri',
      tanggalLahir: '2019-04-18',
      jenisKelamin: 'Perempuan',
      asalSekolah: 'TK Islam Al-Azhar',
      namaOrangTua: 'Rahmat Hidayat',
      noTelepon: '081234567895',
      email: 'rahmat.hidayat@email.com',
      alamat: 'Jl. Raya Bogor No. 147, Depok',
      catatan: 'Sudah bisa membaca dan menulis',
      status: 'pending',
    },
    {
      namaLengkap: 'Dimas Aditya',
      tanggalLahir: '2019-08-30',
      jenisKelamin: 'Laki-laki',
      asalSekolah: null,
      namaOrangTua: 'Agus Setiawan',
      noTelepon: '081234567896',
      email: 'agus.setiawan@email.com',
      alamat: 'Jl. Mawar No. 258, Bandung',
      catatan: null,
      status: 'approved',
    },
    {
      namaLengkap: 'Nabila Syakira',
      tanggalLahir: '2019-06-12',
      jenisKelamin: 'Perempuan',
      asalSekolah: 'TK Ceria',
      namaOrangTua: 'Fitri Handayani',
      noTelepon: '081234567897',
      email: 'fitri.handayani@email.com',
      alamat: 'Jl. Pahlawan No. 369, Surabaya',
      catatan: 'Suka bernyanyi dan menari',
      status: 'pending',
    },
  ];

  for (const studentData of dummyStudents) {
    const student = await prisma.prospectiveStudent.create({
      data: studentData,
    });
    console.log(`  ✅ ${student.namaLengkap} - Status: ${student.status}`);
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - Roles: ${createdRoles.length}`);
  console.log(`  - Menus: ${createdMenus.length}`);
  console.log(`  - Users: 3`);
  console.log(`  - Prospective Students: ${dummyStudents.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
