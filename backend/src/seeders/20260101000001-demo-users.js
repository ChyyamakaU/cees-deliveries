'use strict';

const bcrypt = require('bcryptjs');
const {
  ROLES,
  USER_STATUS,
  RIDER_AVAILABILITY,
  VEHICLE_TYPE,
} = require('../utils/constants');

const DEMO_PASSWORD = {
  admin: 'Admin@123',
  customer: 'Customer@123',
  rider: 'Rider@123',
};

/** Passwords are pre-hashed so seeding stays deterministic and fast. */
const hash = (plain) => bcrypt.hashSync(plain, 10);

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const users = [
      {
        first_name: 'Cee',
        last_name: 'Admin',
        email: 'admin@ceesdeliveries.com',
        phone: '+2348000000001',
        password: hash(DEMO_PASSWORD.admin),
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      },
      {
        first_name: 'Ada',
        last_name: 'Okafor',
        email: 'ada@example.com',
        phone: '+2348000000002',
        password: hash(DEMO_PASSWORD.customer),
        role: ROLES.CUSTOMER,
        status: USER_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      },
      {
        first_name: 'Tunde',
        last_name: 'Bello',
        email: 'tunde@example.com',
        phone: '+2348000000003',
        password: hash(DEMO_PASSWORD.customer),
        role: ROLES.CUSTOMER,
        status: USER_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      },
      {
        first_name: 'Musa',
        last_name: 'Ibrahim',
        email: 'musa@example.com',
        phone: '+2348000000004',
        password: hash(DEMO_PASSWORD.rider),
        role: ROLES.RIDER,
        status: USER_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      },
      {
        first_name: 'Ngozi',
        last_name: 'Eze',
        email: 'ngozi@example.com',
        phone: '+2348000000005',
        password: hash(DEMO_PASSWORD.rider),
        role: ROLES.RIDER,
        status: USER_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      },
      {
        first_name: 'Bola',
        last_name: 'Ade',
        email: 'bola@example.com',
        phone: '+2348000000006',
        password: hash(DEMO_PASSWORD.rider),
        role: ROLES.RIDER,
        status: USER_STATUS.INACTIVE,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert(
      'users',
      users.map((u) => ({ ...u, email: u.email.toLowerCase() }))
    );

    const inserted = await queryInterface.sequelize.query(
      'SELECT id, email FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const idByEmail = Object.fromEntries(inserted.map((u) => [u.email, u.id]));

    await queryInterface.bulkInsert('rider_profiles', [
      {
        user_id: idByEmail['musa@example.com'],
        license_number: 'LAG-RDR-1001',
        vehicle_type: VEHICLE_TYPE.BIKE,
        vehicle_plate_number: 'LAG-234-XY',
        availability: RIDER_AVAILABILITY.AVAILABLE,
        is_verified: true,
        rating: 4.8,
        total_deliveries: 42,
        current_latitude: 6.5244,
        current_longitude: 3.3792,
        created_at: now,
        updated_at: now,
      },
      {
        user_id: idByEmail['ngozi@example.com'],
        license_number: 'LAG-RDR-1002',
        vehicle_type: VEHICLE_TYPE.CAR,
        vehicle_plate_number: 'LAG-889-KJ',
        availability: RIDER_AVAILABILITY.OFFLINE,
        is_verified: true,
        rating: 4.5,
        total_deliveries: 17,
        current_latitude: 6.6018,
        current_longitude: 3.3515,
        created_at: now,
        updated_at: now,
      },
      {
        user_id: idByEmail['bola@example.com'],
        license_number: 'LAG-RDR-1003',
        vehicle_type: VEHICLE_TYPE.VAN,
        vehicle_plate_number: 'LAG-102-AA',
        availability: RIDER_AVAILABILITY.OFFLINE,
        is_verified: false,
        rating: 0,
        total_deliveries: 0,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
