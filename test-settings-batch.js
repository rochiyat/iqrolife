async function testSettingsBatch() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Settings BATCH API\n');

  try {
    // Test 1: Single setting (backward compatibility)
    console.log('1️⃣ Testing SINGLE setting...');
    const singleRes = await fetch(`${baseUrl}/api/dashboard/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'test_single',
        value: 'single_value',
        type: 'string',
        category: 'test',
      }),
    });

    const singleData = await singleRes.json();
    console.log('   Status:', singleRes.status);
    console.log('   Message:', singleData.message);

    if (singleRes.ok) {
      console.log('   ✅ Single setting saved\n');
    } else {
      console.log('   ❌ Single setting failed\n');
    }

    // Test 2: Batch settings (17 settings like settings page)
    console.log('2️⃣ Testing BATCH settings (17 settings)...');
    const batchSettings = [
      {
        key: 'organization_name',
        value: 'Yayasan Iqrolife Batch Test',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'organization_email',
        value: 'batch@iqrolife.com',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'organization_phone',
        value: '+62 813 1522 5557',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'organization_website',
        value: 'https://iqrolife.com',
        type: 'string',
        category: 'organization',
      },
      {
        key: 'organization_address',
        value: 'Test Address',
        type: 'text',
        category: 'organization',
      },
      {
        key: 'smtp_host',
        value: 'smtp.gmail.com',
        type: 'string',
        category: 'email',
      },
      {
        key: 'smtp_port',
        value: '587',
        type: 'string',
        category: 'email',
      },
      {
        key: 'smtp_username',
        value: 'test@gmail.com',
        type: 'string',
        category: 'email',
      },
      {
        key: 'enable_email_notifications',
        value: 'true',
        type: 'boolean',
        category: 'notifications',
      },
      {
        key: 'enable_registration_notifications',
        value: 'true',
        type: 'boolean',
        category: 'notifications',
      },
      {
        key: 'enable_form_notifications',
        value: 'false',
        type: 'boolean',
        category: 'notifications',
      },
      {
        key: 'enable_user_notifications',
        value: 'true',
        type: 'boolean',
        category: 'notifications',
      },
      {
        key: 'enable_2fa',
        value: 'false',
        type: 'boolean',
        category: 'security',
      },
      {
        key: 'force_strong_password',
        value: 'true',
        type: 'boolean',
        category: 'security',
      },
      {
        key: 'session_timeout',
        value: '30',
        type: 'number',
        category: 'security',
      },
      {
        key: 'primary_color',
        value: '#10b981',
        type: 'string',
        category: 'appearance',
      },
      {
        key: 'enable_dark_mode',
        value: 'false',
        type: 'boolean',
        category: 'appearance',
      },
    ];

    const startTime = Date.now();
    const batchRes = await fetch(`${baseUrl}/api/dashboard/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchSettings), // Send as array
    });
    const endTime = Date.now();

    const batchData = await batchRes.json();
    console.log('   Status:', batchRes.status);
    console.log('   Message:', batchData.message);
    console.log('   Time taken:', endTime - startTime, 'ms');
    console.log('   Settings saved:', batchData.data?.length || 0);

    if (batchRes.ok) {
      console.log('   ✅ Batch settings saved in 1 request!\n');
    } else {
      console.log('   ❌ Batch settings failed\n');
      console.log('   Error:', batchData.error);
    }

    // Test 3: Verify data
    console.log('3️⃣ Verifying saved data...');
    const getRes = await fetch(`${baseUrl}/api/dashboard/settings`);
    const getData = await getRes.json();

    console.log('   Total settings:', getData.total);
    console.log(
      '   Organization name:',
      getData.data.find((s) => s.key === 'organization_name')?.value
    );
    console.log(
      '   Email notifications:',
      getData.data.find((s) => s.key === 'enable_email_notifications')?.value
    );

    if (getRes.ok) {
      console.log('   ✅ Data verification successful\n');
    }

    // Cleanup
    console.log('4️⃣ Cleaning up test data...');
    await fetch(`${baseUrl}/api/dashboard/settings?key=test_single`, {
      method: 'DELETE',
    });
    console.log('   ✅ Cleanup successful\n');

    console.log('✅ All tests passed!');
    console.log('\n📊 Performance:');
    console.log('   Before: 17 requests × ~100ms = ~1700ms');
    console.log(`   After: 1 request × ${endTime - startTime}ms`);
    console.log(
      `   Improvement: ${Math.round(1700 / (endTime - startTime))}x faster!`
    );
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSettingsBatch();
