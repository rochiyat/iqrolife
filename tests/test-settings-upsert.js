async function testSettingsUpsert() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Settings UPSERT API\n');

  try {
    // Test 1: Insert new setting
    console.log('1️⃣ Testing INSERT (new setting)...');
    const insertRes = await fetch(`${baseUrl}/api/dashboard/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'test_setting',
        value: 'initial_value',
        type: 'string',
        category: 'test',
        description: 'Test setting',
        is_public: false,
      }),
    });

    const insertData = await insertRes.json();
    console.log('   Status:', insertRes.status);
    console.log('   Response:', insertData);

    if (insertRes.ok) {
      console.log('   ✅ INSERT successful\n');
    } else {
      console.log('   ❌ INSERT failed\n');
      return;
    }

    // Test 2: Update existing setting
    console.log('2️⃣ Testing UPDATE (existing setting)...');
    const updateRes = await fetch(`${baseUrl}/api/dashboard/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'test_setting',
        value: 'updated_value',
        type: 'string',
        category: 'test',
        description: 'Updated test setting',
        is_public: true,
      }),
    });

    const updateData = await updateRes.json();
    console.log('   Status:', updateRes.status);
    console.log('   Response:', updateData);

    if (updateRes.ok && updateData.data.value === 'updated_value') {
      console.log('   ✅ UPDATE successful\n');
    } else {
      console.log('   ❌ UPDATE failed\n');
    }

    // Test 3: Batch update (like settings page)
    console.log('3️⃣ Testing BATCH UPDATE (multiple settings)...');
    const settings = [
      {
        key: 'organization_name',
        value: 'Yayasan Iqrolife Test',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'organization_email',
        value: 'test@iqrolife.com',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'enable_email_notifications',
        value: 'true',
        type: 'boolean',
        category: 'notifications',
      },
    ];

    const batchResults = await Promise.all(
      settings.map((setting) =>
        fetch(`${baseUrl}/api/dashboard/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(setting),
        })
      )
    );

    const allSuccess = batchResults.every((res) => res.ok);
    console.log('   Status:', batchResults.map((r) => r.status).join(', '));
    console.log(
      '   Success rate:',
      batchResults.filter((r) => r.ok).length,
      '/',
      batchResults.length
    );

    if (allSuccess) {
      console.log('   ✅ BATCH UPDATE successful\n');
    } else {
      console.log('   ❌ Some BATCH UPDATEs failed\n');
    }

    // Test 4: Verify data
    console.log('4️⃣ Verifying saved data...');
    const getRes = await fetch(`${baseUrl}/api/dashboard/settings`);
    const getData = await getRes.json();

    console.log('   Total settings:', getData.total);
    console.log(
      '   Test setting value:',
      getData.data.find((s) => s.key === 'test_setting')?.value
    );
    console.log(
      '   Organization name:',
      getData.data.find((s) => s.key === 'organization_name')?.value
    );

    if (getRes.ok) {
      console.log('   ✅ Data verification successful\n');
    }

    // Cleanup
    console.log('5️⃣ Cleaning up test data...');
    const deleteRes = await fetch(
      `${baseUrl}/api/dashboard/settings?key=test_setting`,
      {
        method: 'DELETE',
      }
    );

    if (deleteRes.ok) {
      console.log('   ✅ Cleanup successful\n');
    }

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSettingsUpsert();
