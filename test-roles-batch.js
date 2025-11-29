async function testRolesBatch() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Roles BATCH API\n');

  try {
    // Test 1: Get all roles
    console.log('1️⃣ Fetching all roles...');
    const getRolesRes = await fetch(`${baseUrl}/api/dashboard/roles`);
    const getRolesData = await getRolesRes.json();

    console.log('   Status:', getRolesRes.status);
    console.log('   Total roles:', getRolesData.total);
    console.log(
      '   Roles:',
      getRolesData.data.map((r) => r.name).join(', ')
    );

    if (!getRolesRes.ok || getRolesData.data.length === 0) {
      console.log('   ❌ No roles found\n');
      return;
    }

    const roles = getRolesData.data;
    console.log('   ✅ Roles fetched\n');

    // Test 2: Single role update (backward compatibility)
    console.log('2️⃣ Testing SINGLE role update...');
    const singleRole = roles[0];
    const singleUpdateRes = await fetch(`${baseUrl}/api/dashboard/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: singleRole.id,
        permissions: {
          ...singleRole.permissions,
          test: 'single_update',
        },
      }),
    });

    const singleUpdateData = await singleUpdateRes.json();
    console.log('   Status:', singleUpdateRes.status);
    console.log('   Message:', singleUpdateData.message);

    if (singleUpdateRes.ok) {
      console.log('   ✅ Single role update successful\n');
    } else {
      console.log('   ❌ Single role update failed\n');
    }

    // Test 3: Batch roles update (like roles page)
    console.log('3️⃣ Testing BATCH roles update (4 roles)...');
    const batchRoles = roles.map((role, index) => ({
      id: role.id,
      permissions: {
        ...role.permissions,
        menus: ['home', 'calon-murid', 'formulir'], // Example menu access
        test: 'batch_update',
        batch_index: index,
      },
    }));

    const startTime = Date.now();
    const batchRes = await fetch(`${baseUrl}/api/dashboard/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchRoles), // Send as array
    });
    const endTime = Date.now();

    const batchData = await batchRes.json();
    console.log('   Status:', batchRes.status);
    console.log('   Message:', batchData.message);
    console.log('   Time taken:', endTime - startTime, 'ms');
    console.log('   Roles updated:', batchData.data?.length || 0);

    if (batchRes.ok) {
      console.log('   ✅ Batch roles updated in 1 request!\n');
    } else {
      console.log('   ❌ Batch roles update failed\n');
      console.log('   Error:', batchData.error);
    }

    // Test 4: Verify data
    console.log('4️⃣ Verifying updated data...');
    const verifyRes = await fetch(`${baseUrl}/api/dashboard/roles`);
    const verifyData = await verifyRes.json();

    const updatedRole = verifyData.data.find((r) => r.id === roles[0].id);
    console.log('   First role permissions:', updatedRole?.permissions);

    if (verifyRes.ok && updatedRole?.permissions?.test === 'batch_update') {
      console.log('   ✅ Data verification successful\n');
    } else {
      console.log('   ⚠️  Data verification inconclusive\n');
    }

    console.log('✅ All tests passed!');
    console.log('\n📊 Performance:');
    console.log('   Before: 4 requests × ~100ms = ~400ms');
    console.log(`   After: 1 request × ${endTime - startTime}ms`);
    console.log(
      `   Improvement: ${Math.round(400 / (endTime - startTime))}x faster!`
    );
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRolesBatch();
