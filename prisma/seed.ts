import { PrismaClient, HTTPMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - tùy bạn có muốn xóa hay không)
  // await prisma.permission.deleteMany({});
  // await prisma.role.deleteMany({});

  // ===========================
  // ROLES
  // ===========================
  console.log('📝 Creating roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access - Can manage all resources',
      isActive: true,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Standard user access - Can manage own resources',
      isActive: true,
    },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: 'Guest' },
    update: {},
    create: {
      name: 'Guest',
      description: 'Limited access - Read-only permissions',
      isActive: true,
    },
  });

  console.log(`✅ Created/Updated ${3} roles`);

  // ===========================
  // PERMISSIONS
  // ===========================
  console.log('🔐 Creating permissions...');

  // User Management Permissions
  const userPermissions = [
    {
      name: 'List Users',
      description: 'View all users in the system',
      path: '/users',
      method: HTTPMethod.GET,
    },
    {
      name: 'Get User',
      description: 'View a specific user details',
      path: '/users/:id',
      method: HTTPMethod.GET,
    },
    {
      name: 'Create User',
      description: 'Create a new user',
      path: '/users',
      method: HTTPMethod.POST,
    },
    {
      name: 'Update User',
      description: 'Update user information',
      path: '/users/:id',
      method: HTTPMethod.PUT,
    },
    {
      name: 'Delete User',
      description: 'Delete a user from the system',
      path: '/users/:id',
      method: HTTPMethod.DELETE,
    },
  ];

  // Product Management Permissions
  const productPermissions = [
    {
      name: 'List Products',
      description: 'View all products',
      path: '/products',
      method: HTTPMethod.GET,
    },
    {
      name: 'Get Product',
      description: 'View a specific product details',
      path: '/products/:id',
      method: HTTPMethod.GET,
    },
    {
      name: 'Create Product',
      description: 'Create a new product',
      path: '/products',
      method: HTTPMethod.POST,
    },
    {
      name: 'Update Product',
      description: 'Update product information',
      path: '/products/:id',
      method: HTTPMethod.PUT,
    },
    {
      name: 'Delete Product',
      description: 'Delete a product',
      path: '/products/:id',
      method: HTTPMethod.DELETE,
    },
  ];

  // Order Management Permissions
  const orderPermissions = [
    {
      name: 'List Orders',
      description: 'View all orders',
      path: '/orders',
      method: HTTPMethod.GET,
    },
    {
      name: 'Get Order',
      description: 'View a specific order details',
      path: '/orders/:id',
      method: HTTPMethod.GET,
    },
    {
      name: 'Create Order',
      description: 'Create a new order',
      path: '/orders',
      method: HTTPMethod.POST,
    },
    {
      name: 'Update Order',
      description: 'Update order status',
      path: '/orders/:id',
      method: HTTPMethod.PUT,
    },
    {
      name: 'Cancel Order',
      description: 'Cancel an order',
      path: '/orders/:id',
      method: HTTPMethod.DELETE,
    },
  ];

  // Role & Permission Management
  const adminPermissions = [
    {
      name: 'Manage Roles',
      description: 'Create, update, delete roles',
      path: '/roles',
      method: HTTPMethod.POST,
    },
    {
      name: 'Manage Permissions',
      description: 'Assign permissions to roles',
      path: '/permissions',
      method: HTTPMethod.POST,
    },
  ];

  // Create all permissions
  const allPermissions = [
    ...userPermissions,
    ...productPermissions,
    ...orderPermissions,
    ...adminPermissions,
  ];

  const createdPermissions: any[] = [];
  for (const perm of allPermissions) {
    // Find existing permission
    const existing = await prisma.permission.findFirst({
      where: {
        name: perm.name,
        path: perm.path,
        method: perm.method,
      },
    });

    // Create or skip if exists
    if (existing) {
      createdPermissions.push(existing);
    } else {
      const permission = await prisma.permission.create({
        data: perm,
      });
      createdPermissions.push(permission);
    }
  }

  console.log(`✅ Created/Updated ${createdPermissions.length} permissions`);

  // ===========================
  // ASSIGN PERMISSIONS TO ROLES
  // ===========================
  console.log('🔗 Assigning permissions to roles...');

  // Admin gets ALL permissions
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: createdPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // User gets limited permissions
  const userAllowedPermissions = createdPermissions.filter((p) =>
    [
      'List Products',
      'Get Product',
      'List Orders',
      'Get Order',
      'Create Order',
      'Update Order',
    ].includes(p.name),
  );

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: {
        connect: userAllowedPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  // Guest gets read-only permissions
  const guestAllowedPermissions = createdPermissions.filter((p) =>
    ['List Products', 'Get Product'].includes(p.name),
  );

  await prisma.role.update({
    where: { id: guestRole.id },
    data: {
      permissions: {
        connect: guestAllowedPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  console.log('✅ Permissions assigned to roles');

  // ===========================
  // LANGUAGES
  // ===========================
  console.log('🌍 Creating languages...');

  const languages = [
    { code: 'vi', name: 'Vietnamese' },
    { code: 'en', name: 'English' },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: {
        code: lang.code,
        name: lang.name,
      },
    });
  }

  console.log(`✅ Created/Updated ${languages.length} languages`);

  // ===========================
  // SUMMARY
  // ===========================
  console.log('\n🎉 Seeding completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Languages: ${languages.length}`);
  console.log(`   - Roles: ${3}`);
  console.log(`   - Permissions: ${createdPermissions.length}`);
  console.log(`   - Admin permissions: ${createdPermissions.length}`);
  console.log(`   - User permissions: ${userAllowedPermissions.length}`);
  console.log(`   - Guest permissions: ${guestAllowedPermissions.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
