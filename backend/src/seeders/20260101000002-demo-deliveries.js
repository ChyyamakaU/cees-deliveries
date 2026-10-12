/* eslint-disable no-undef */
'use strict';

const {
  DELIVERY_STATUS,
  PACKAGE_SIZE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} = require('../utils/constants');

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      'SELECT id, email FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const idByEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));

    const ada = idByEmail['ada@example.com'];
    const tunde = idByEmail['tunde@example.com'];
    const musa = idByEmail['musa@example.com'];
    const ngozi = idByEmail['ngozi@example.com'];

    const deliveries = [
      {
        tracking_code: 'CD-DEMO-0001',
        customer_id: ada,
        rider_id: null,
        status: DELIVERY_STATUS.PENDING,
        pickup_label: 'Shoprite Ikeja',
        pickup_address: '1 Obafemi Awolowo Way, Ikeja, Lagos',
        pickup_contact_name: 'Ada Okafor',
        pickup_contact_phone: '+2348000000002',
        pickup_latitude: 6.6018,
        pickup_longitude: 3.3515,
        dropoff_label: 'Lekki Phase 1',
        dropoff_address: '12 Admiralty Way, Lekki Phase 1, Lagos',
        dropoff_contact_name: 'Kunle Adams',
        dropoff_contact_phone: '+2348000000100',
        dropoff_latitude: 6.4478,
        dropoff_longitude: 3.4723,
        package_description: 'Two boxes of groceries',
        package_size: PACKAGE_SIZE.MEDIUM,
        package_weight: 6.5,
        distance_km: 18.4,
        delivery_fee: 2708,
        currency: 'NGN',
        notes: 'Call on arrival',
        created_at: daysAgo(0),
        updated_at: daysAgo(0),
      },
      {
        tracking_code: 'CD-DEMO-0002',
        customer_id: ada,
        rider_id: null,
        status: DELIVERY_STATUS.CONFIRMED,
        pickup_label: 'Ikeja City Mall',
        pickup_address: 'Alausa, Ikeja, Lagos',
        pickup_contact_name: 'Ada Okafor',
        pickup_contact_phone: '+2348000000002',
        pickup_latitude: 6.6130,
        pickup_longitude: 3.3588,
        dropoff_label: 'Yaba Tech',
        dropoff_address: '8 Herbert Macaulay Way, Yaba, Lagos',
        dropoff_contact_name: 'Grace Umeh',
        dropoff_contact_phone: '+2348000000101',
        dropoff_latitude: 6.5158,
        dropoff_longitude: 3.3712,
        package_description: 'Laptop bag',
        package_size: PACKAGE_SIZE.SMALL,
        package_weight: 2.1,
        distance_km: 12.0,
        delivery_fee: 1940,
        currency: 'NGN',
        confirmed_at: daysAgo(1),
        created_at: daysAgo(1),
        updated_at: daysAgo(1),
      },
      {
        tracking_code: 'CD-DEMO-0003',
        customer_id: tunde,
        rider_id: musa,
        status: DELIVERY_STATUS.ASSIGNED,
        pickup_label: 'Victoria Island Office',
        pickup_address: '30 Adeola Odeku St, Victoria Island, Lagos',
        pickup_contact_name: 'Tunde Bello',
        pickup_contact_phone: '+2348000000003',
        pickup_latitude: 6.4281,
        pickup_longitude: 3.4219,
        dropoff_label: 'Surulere Home',
        dropoff_address: '45 Bode Thomas St, Surulere, Lagos',
        dropoff_contact_name: 'Tunde Bello',
        dropoff_contact_phone: '+2348000000003',
        dropoff_latitude: 6.4999,
        dropoff_longitude: 3.3533,
        package_description: 'Office documents',
        package_size: PACKAGE_SIZE.SMALL,
        package_weight: 0.8,
        distance_km: 9.3,
        delivery_fee: 1616,
        currency: 'NGN',
        confirmed_at: daysAgo(2),
        assigned_at: daysAgo(2),
        created_at: daysAgo(2),
        updated_at: daysAgo(2),
      },
      {
        tracking_code: 'CD-DEMO-0004',
        customer_id: tunde,
        rider_id: musa,
        status: DELIVERY_STATUS.IN_TRANSIT,
        pickup_label: 'Apapa Port',
        pickup_address: 'Wharf Road, Apapa, Lagos',
        pickup_contact_name: 'Tunde Bello',
        pickup_contact_phone: '+2348000000003',
        pickup_latitude: 6.4478,
        pickup_longitude: 3.3596,
        dropoff_label: 'Ikeja GRA',
        dropoff_address: '14 Sobo Arobiodu St, Ikeja GRA, Lagos',
        dropoff_contact_name: 'Sade Bello',
        dropoff_contact_phone: '+2348000000102',
        dropoff_latitude: 6.5826,
        dropoff_longitude: 3.3478,
        package_description: 'Spare parts',
        package_size: PACKAGE_SIZE.LARGE,
        package_weight: 22.0,
        distance_km: 15.7,
        delivery_fee: 3014,
        currency: 'NGN',
        confirmed_at: daysAgo(1),
        assigned_at: daysAgo(1),
        picked_up_at: daysAgo(0),
        in_transit_at: daysAgo(0),
        created_at: daysAgo(1),
        updated_at: daysAgo(0),
      },
      {
        tracking_code: 'CD-DEMO-0005',
        customer_id: ada,
        rider_id: ngozi,
        status: DELIVERY_STATUS.DELIVERED,
        pickup_label: 'Mushin Market',
        pickup_address: 'Agege Motor Rd, Mushin, Lagos',
        pickup_contact_name: 'Ada Okafor',
        pickup_contact_phone: '+2348000000002',
        pickup_latitude: 6.5278,
        pickup_longitude: 3.3489,
        dropoff_label: 'Maryland Mall',
        dropoff_address: '350 Ikorodu Rd, Maryland, Lagos',
        dropoff_contact_name: 'Ada Okafor',
        dropoff_contact_phone: '+2348000000002',
        dropoff_latitude: 6.5720,
        dropoff_longitude: 3.3670,
        package_description: 'Fabric bundle',
        package_size: PACKAGE_SIZE.MEDIUM,
        package_weight: 8.0,
        distance_km: 6.2,
        delivery_fee: 1244,
        currency: 'NGN',
        confirmed_at: daysAgo(6),
        assigned_at: daysAgo(6),
        picked_up_at: daysAgo(6),
        in_transit_at: daysAgo(6),
        delivered_at: daysAgo(5),
        created_at: daysAgo(6),
        updated_at: daysAgo(5),
      },
    ];

    await queryInterface.bulkInsert('deliveries', deliveries);

    const insertedDeliveries = await queryInterface.sequelize.query(
      'SELECT id, tracking_code, delivery_fee FROM deliveries;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const deliveryByCode = Object.fromEntries(insertedDeliveries.map((d) => [d.tracking_code, d]));

    await queryInterface.bulkInsert('payments', [
      {
        delivery_id: deliveryByCode['CD-DEMO-0002'].id,
        reference: 'PAY-DEMO-0002',
        amount: deliveryByCode['CD-DEMO-0002'].delivery_fee,
        currency: 'NGN',
        method: PAYMENT_METHOD.CARD,
        status: PAYMENT_STATUS.SUCCESSFUL,
        transaction_id: 'TXN-DEMO-0002',
        paid_at: daysAgo(1),
        created_at: daysAgo(1),
        updated_at: daysAgo(1),
      },
      {
        delivery_id: deliveryByCode['CD-DEMO-0003'].id,
        reference: 'PAY-DEMO-0003',
        amount: deliveryByCode['CD-DEMO-0003'].delivery_fee,
        currency: 'NGN',
        method: PAYMENT_METHOD.TRANSFER,
        status: PAYMENT_STATUS.SUCCESSFUL,
        transaction_id: 'TXN-DEMO-0003',
        paid_at: daysAgo(2),
        created_at: daysAgo(2),
        updated_at: daysAgo(2),
      },
      {
        delivery_id: deliveryByCode['CD-DEMO-0004'].id,
        reference: 'PAY-DEMO-0004',
        amount: deliveryByCode['CD-DEMO-0004'].delivery_fee,
        currency: 'NGN',
        method: PAYMENT_METHOD.CASH,
        status: PAYMENT_STATUS.PENDING,
        created_at: daysAgo(1),
        updated_at: daysAgo(1),
      },
      {
        delivery_id: deliveryByCode['CD-DEMO-0005'].id,
        reference: 'PAY-DEMO-0005',
        amount: deliveryByCode['CD-DEMO-0005'].delivery_fee,
        currency: 'NGN',
        method: PAYMENT_METHOD.CASH,
        status: PAYMENT_STATUS.SUCCESSFUL,
        paid_at: daysAgo(5),
        created_at: daysAgo(6),
        updated_at: daysAgo(5),
      },
    ]);

    const history = [
      { delivery_id: deliveryByCode['CD-DEMO-0001'].id, status: DELIVERY_STATUS.PENDING, previous_status: null, changed_by_id: ada, note: 'Delivery request created', created_at: daysAgo(0) },
      { delivery_id: deliveryByCode['CD-DEMO-0002'].id, status: DELIVERY_STATUS.PENDING, previous_status: null, changed_by_id: ada, note: 'Delivery request created', created_at: daysAgo(1) },
      { delivery_id: deliveryByCode['CD-DEMO-0002'].id, status: DELIVERY_STATUS.CONFIRMED, previous_status: DELIVERY_STATUS.PENDING, changed_by_id: ada, note: 'Delivery confirmed', created_at: daysAgo(1) },
      { delivery_id: deliveryByCode['CD-DEMO-0003'].id, status: DELIVERY_STATUS.PENDING, previous_status: null, changed_by_id: tunde, note: 'Delivery request created', created_at: daysAgo(2) },
      { delivery_id: deliveryByCode['CD-DEMO-0003'].id, status: DELIVERY_STATUS.CONFIRMED, previous_status: DELIVERY_STATUS.PENDING, changed_by_id: tunde, note: 'Delivery confirmed', created_at: daysAgo(2) },
      { delivery_id: deliveryByCode['CD-DEMO-0003'].id, status: DELIVERY_STATUS.ASSIGNED, previous_status: DELIVERY_STATUS.CONFIRMED, changed_by_id: null, note: 'Rider assigned', created_at: daysAgo(2) },
      { delivery_id: deliveryByCode['CD-DEMO-0004'].id, status: DELIVERY_STATUS.PENDING, previous_status: null, changed_by_id: tunde, note: 'Delivery request created', created_at: daysAgo(1) },
      { delivery_id: deliveryByCode['CD-DEMO-0004'].id, status: DELIVERY_STATUS.CONFIRMED, previous_status: DELIVERY_STATUS.PENDING, changed_by_id: tunde, note: 'Delivery confirmed', created_at: daysAgo(1) },
      { delivery_id: deliveryByCode['CD-DEMO-0004'].id, status: DELIVERY_STATUS.ASSIGNED, previous_status: DELIVERY_STATUS.CONFIRMED, changed_by_id: null, note: 'Rider assigned', created_at: daysAgo(1) },
      { delivery_id: deliveryByCode['CD-DEMO-0004'].id, status: DELIVERY_STATUS.PICKED_UP, previous_status: DELIVERY_STATUS.ASSIGNED, changed_by_id: musa, note: 'Package picked up', created_at: daysAgo(0) },
      { delivery_id: deliveryByCode['CD-DEMO-0004'].id, status: DELIVERY_STATUS.IN_TRANSIT, previous_status: DELIVERY_STATUS.PICKED_UP, changed_by_id: musa, note: 'On the way', created_at: daysAgo(0) },
      { delivery_id: deliveryByCode['CD-DEMO-0005'].id, status: DELIVERY_STATUS.PENDING, previous_status: null, changed_by_id: ada, note: 'Delivery request created', created_at: daysAgo(6) },
      { delivery_id: deliveryByCode['CD-DEMO-0005'].id, status: DELIVERY_STATUS.DELIVERED, previous_status: DELIVERY_STATUS.IN_TRANSIT, changed_by_id: ngozi, note: 'Delivered to recipient', created_at: daysAgo(5) },
    ];

    await queryInterface.bulkInsert('delivery_status_histories', history);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('delivery_status_histories', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('deliveries', null, {});
  },
};
