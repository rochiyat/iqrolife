// Simulate the logic in lib/auth-context.tsx
const fallbackPermissions = {
  superadmin: {
    menus: [
      'home',
      'calon-murid',
      'formulir-list',
      'users',
      'roles',
      'menu',
      'formulir',
      'portofolio',
      'settings',
    ],
    canAccessAll: true,
  },
  staff: {
    menus: ['home', 'calon-murid', 'formulir-list', 'formulir', 'portofolio'],
    canAccessAll: false,
  },
};

function getUserPermissions(user) {
  if (!user) return {};

  if (user.permissions) {
    if (!user.permissions.menus || !Array.isArray(user.permissions.menus)) {
      console.log('Fallback triggered for role:', user.role);
      const fallback = fallbackPermissions[user.role];
      return {
        ...user.permissions,
        menus: fallback.menus,
      };
    }
    return user.permissions;
  }
  return fallbackPermissions[user.role];
}

// Test Case 1: User with permissions but NO menus (Simulating the bug)
const userWithBug = {
  role: 'superadmin',
  permissions: {
    canAccessAll: true,
    // menus is missing
  }
};

const result1 = getUserPermissions(userWithBug);
console.log('Test 1 (Missing Menus):', result1.menus.includes('formulir-list') ? 'PASS' : 'FAIL');
console.log('Menus:', result1.menus);

// Test Case 2: User with permissions AND menus (Normal case)
const userNormal = {
  role: 'superadmin',
  permissions: {
    canAccessAll: true,
    menus: ['home'] // Only home
  }
};

const result2 = getUserPermissions(userNormal);
console.log('Test 2 (Existing Menus):', result2.menus.length === 1 ? 'PASS' : 'FAIL');

// Test Case 3: User without permissions (Fallback case)
const userNoPerms = {
  role: 'staff'
};

const result3 = getUserPermissions(userNoPerms);
console.log('Test 3 (No Perms):', result3.menus.includes('formulir-list') ? 'PASS' : 'FAIL');
