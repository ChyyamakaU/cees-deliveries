/* eslint-disable no-console */
/**
 * End-to-end smoke test for the Cee's Deliveries API.
 * Exercises the full happy path plus key business-rule guards.
 *
 * Usage:  node scripts/smoke-test.js   (server must be running)
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

let passed = 0;
let failed = 0;

function check(name, condition, extra) {
  if (condition) {
    passed += 1;
    console.log(`  \u2713 ${name}`);
  } else {
    failed += 1;
    console.log(`  \u2717 ${name}${extra ? ` -> ${JSON.stringify(extra)}` : ''}`);
  }
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch (e) {
    json = null;
  }
  return { status: res.status, body: json };
}

const runId = Date.now().toString(36);

async function main() {
  console.log(`\nCee's Deliveries smoke test -> ${BASE_URL}\n`);

  // --- Health ---------------------------------------------------------
  console.log('Health');
  const health = await api('GET', '/health');
  check('GET /health returns 200', health.status === 200, health.body);

  // --- Admin login ----------------------------------------------------
  console.log('\nAuthentication');
  const adminLogin = await api('POST', '/auth/login', {
    body: { email: 'admin@ceesdeliveries.com', password: 'Admin@123' },
  });
  check('admin can log in', adminLogin.status === 200 && adminLogin.body.data.token);
  const adminToken = adminLogin.body.data.token;

  const badLogin = await api('POST', '/auth/login', {
    body: { email: 'admin@ceesdeliveries.com', password: 'wrong' },
  });
  check('wrong password is rejected (401)', badLogin.status === 401);

  // --- Customer registration -----------------------------------------
  const custEmail = `smoke.customer.${runId}@example.com`;
  const reg = await api('POST', '/auth/register', {
    body: {
      firstName: 'Smoke',
      lastName: 'Customer',
      email: custEmail,
      phone: `+2349${runId}`.slice(0, 15),
      password: 'Customer@123',
    },
  });
  check('customer can register', reg.status === 201 && reg.body.data.token, reg.body);
  const customerToken = reg.body.data.token;

  const dupe = await api('POST', '/auth/register', {
    body: {
      firstName: 'Smoke',
      lastName: 'Customer',
      email: custEmail,
      phone: '+2340000000999',
      password: 'Customer@123',
    },
  });
  check('duplicate email is rejected (409)', dupe.status === 409);

  const me = await api('GET', '/auth/me', { token: customerToken });
  check('customer can fetch own profile', me.status === 200 && me.body.data.role === 'CUSTOMER');

  // --- Quote + create deliveries -------------------------------------
  console.log('\nDelivery creation');
  const quote = await api('POST', '/deliveries/quote', {
    token: customerToken,
    body: {
      packageSize: 'MEDIUM',
      pickupLatitude: 6.5244,
      pickupLongitude: 3.3792,
      dropoffLatitude: 6.4478,
      dropoffLongitude: 3.4723,
    },
  });
  check('quote returns a fee', quote.status === 200 && quote.body.data.deliveryFee > 0, quote.body);

  const deliveryPayload = {
    pickupLabel: 'Smoke Pickup',
    pickupAddress: '1 Test Street, Lagos',
    pickupContactName: 'Smoke Customer',
    pickupContactPhone: '+2348000000002',
    pickupLatitude: 6.5244,
    pickupLongitude: 3.3792,
    dropoffLabel: 'Smoke Dropoff',
    dropoffAddress: '2 Test Avenue, Lagos',
    dropoffContactName: 'Recipient',
    dropoffContactPhone: '+2348000000100',
    dropoffLatitude: 6.4478,
    dropoffLongitude: 3.4723,
    packageDescription: 'Smoke test parcel',
    packageSize: 'SMALL',
    notes: 'Handle with care',
  };

  const d1 = await api('POST', '/deliveries', { token: customerToken, body: deliveryPayload });
  check('customer creates delivery 1', d1.status === 201 && d1.body.data.status === 'PENDING', d1.body);
  const delivery1 = d1.body.data;

  const d2 = await api('POST', '/deliveries', { token: customerToken, body: deliveryPayload });
  check('customer creates delivery 2', d2.status === 201 && d2.body.data.status === 'PENDING');
  const delivery2 = d2.body.data;

  const missingField = await api('POST', '/deliveries', {
    token: customerToken,
    body: { ...deliveryPayload, pickupAddress: '' },
  });
  check('validation rejects missing address (422)', missingField.status === 422);

  const riderCannotCreate = await api('POST', '/deliveries', {
    token: (await api('POST', '/auth/login', { body: { email: 'musa@example.com', password: 'Rider@123' } })).body.data.token,
    body: deliveryPayload,
  });
  check('rider cannot create a delivery (403)', riderCannotCreate.status === 403);

  // --- Confirm --------------------------------------------------------
  console.log('\nLifecycle: confirm');
  for (const delivery of [delivery1, delivery2]) {
    const confirm = await api('PATCH', `/deliveries/${delivery.id}/status`, {
      token: customerToken,
      body: { status: 'CONFIRMED' },
    });
    check(`delivery ${delivery.id} confirmed`, confirm.status === 200 && confirm.body.data.status === 'CONFIRMED', confirm.body);
  }

  const invalidTransition = await api('PATCH', `/deliveries/${delivery1.id}/status`, {
    token: customerToken,
    body: { status: 'DELIVERED' },
  });
  check('illegal jump CONFIRMED -> DELIVERED is blocked (409)', invalidTransition.status === 409);

  // --- Admin assigns Musa to delivery 1 ------------------------------
  console.log('\nAdmin assignment');
  const riders = await api('GET', '/admin/riders?isVerified=true', { token: adminToken });
  const musa = riders.body.data.find((r) => r.user.email === 'musa@example.com');
  const ngozi = riders.body.data.find((r) => r.user.email === 'ngozi@example.com');
  check('admin can list riders', !!musa && !!ngozi);

  const assign = await api('PATCH', `/admin/deliveries/${delivery1.id}/assign`, {
    token: adminToken,
    body: { riderId: musa.user.id },
  });
  check('admin assigns rider to delivery 1', assign.status === 200 && assign.body.data.status === 'ASSIGNED' && assign.body.data.riderId === musa.user.id, assign.body);

  // --- Rider Ngozi comes online and accepts delivery 2 ---------------
  console.log('\nRider self-service');
  const ngoziLogin = await api('POST', '/auth/login', {
    body: { email: 'ngozi@example.com', password: 'Rider@123' },
  });
  const ngoziToken = ngoziLogin.body.data.token;

  const online = await api('PATCH', '/rider/availability', {
    token: ngoziToken,
    body: { availability: 'AVAILABLE' },
  });
  check('rider becomes AVAILABLE', online.status === 200 && online.body.data.availability === 'AVAILABLE', online.body);

  const jobs = await api('GET', '/rider/jobs', { token: ngoziToken });
  check('available jobs include delivery 2', jobs.status === 200 && jobs.body.data.some((j) => j.id === delivery2.id));

  const accept = await api('POST', `/rider/jobs/${delivery2.id}/accept`, { token: ngoziToken });
  check('rider accepts delivery 2', accept.status === 200 && accept.body.data.status === 'ASSIGNED' && accept.body.data.riderId === ngozi.user.id, accept.body);

  const acceptAgain = await api('POST', `/rider/jobs/${delivery1.id}/accept`, { token: ngoziToken });
  check('rider cannot accept an already-assigned job (409)', acceptAgain.status === 409);

  // --- Payment --------------------------------------------------------
  console.log('\nPayments');
  const pay1 = await api('POST', `/deliveries/${delivery1.id}/payments`, {
    token: customerToken,
    body: { method: 'CARD' },
  });
  check('payment initiated for delivery 1', pay1.status === 201 && pay1.body.data.status === 'PENDING', pay1.body);
  const payment1 = pay1.body.data;

  const duplicatePay = await api('POST', `/deliveries/${delivery1.id}/payments`, {
    token: customerToken,
    body: { method: 'CASH' },
  });
  check('duplicate payment is rejected (409)', duplicatePay.status === 409);

  // Rider cannot pick up before a card payment succeeds.
  const earlyPickup = await api('PATCH', `/deliveries/${delivery1.id}/status`, {
    token: (await api('POST', '/auth/login', { body: { email: 'musa@example.com', password: 'Rider@123' } })).body.data.token,
    body: { status: 'PICKED_UP' },
  });
  check('pickup blocked while card payment pending (409)', earlyPickup.status === 409);

  const paid = await api('PATCH', `/payments/${payment1.id}/status`, {
    token: customerToken,
    body: { status: 'SUCCESSFUL' },
  });
  check('card payment marked SUCCESSFUL', paid.status === 200 && paid.body.data.status === 'SUCCESSFUL', paid.body);

  const refundByCustomer = await api('PATCH', `/payments/${payment1.id}/status`, {
    token: customerToken,
    body: { status: 'REFUNDED' },
  });
  check('customer cannot refund a payment (403)', refundByCustomer.status === 403);

  // --- Delivery 1 full progress by Musa ------------------------------
  console.log('\nLifecycle: delivery 1 (Musa)');
  const musaToken = (await api('POST', '/auth/login', { body: { email: 'musa@example.com', password: 'Rider@123' } })).body.data.token;
  for (const status of ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED']) {
    const r = await api('PATCH', `/deliveries/${delivery1.id}/status`, {
      token: musaToken,
      body: { status },
    });
    check(`delivery 1 -> ${status}`, r.status === 200 && r.body.data.status === status, r.body);
  }

  const afterDelivered = await api('PATCH', `/deliveries/${delivery1.id}/status`, {
    token: musaToken,
    body: { status: 'IN_TRANSIT' },
  });
  check('completed delivery is protected (409)', afterDelivered.status === 409);

  const cancelDelivered = await api('POST', `/deliveries/${delivery1.id}/cancel`, {
    token: customerToken,
    body: { reason: 'too late' },
  });
  check('delivered delivery cannot be cancelled (409)', cancelDelivered.status === 409);

  // --- Delivery 2: cash, progressed by Ngozi -------------------------
  console.log('\nLifecycle: delivery 2 (Ngozi, cash)');
  const pay2 = await api('POST', `/deliveries/${delivery2.id}/payments`, {
    token: customerToken,
    body: { method: 'CASH' },
  });
  check('cash payment recorded (PENDING)', pay2.status === 201 && pay2.body.data.status === 'PENDING');

  for (const status of ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED']) {
    const r = await api('PATCH', `/deliveries/${delivery2.id}/status`, {
      token: ngoziToken,
      body: { status },
    });
    check(`delivery 2 -> ${status}`, r.status === 200 && r.body.data.status === status, r.body);
  }

  const pay2Success = await api('PATCH', `/payments/${pay2.body.data.id}/status`, {
    token: adminToken,
    body: { status: 'SUCCESSFUL' },
  });
  check('admin settles cash payment', pay2Success.status === 200);

  // --- Ownership / access control ------------------------------------
  console.log('\nAccess control');
  const otherReg = await api('POST', '/auth/register', {
    body: {
      firstName: 'Other',
      lastName: 'User',
      email: `smoke.other.${runId}@example.com`,
      phone: `+2348${runId}`.slice(0, 15),
      password: 'Customer@123',
    },
  });
  const otherToken = otherReg.body.data.token;
  const forbidden = await api('GET', `/deliveries/${delivery1.id}`, { token: otherToken });
  check('other customer cannot view someone else delivery (403)', forbidden.status === 403);

  const noToken = await api('GET', '/deliveries');
  check('unauthenticated request is rejected (401)', noToken.status === 401);

  const riderAdmin = await api('GET', '/admin/dashboard', { token: musaToken });
  check('rider cannot access admin routes (403)', riderAdmin.status === 403);

  // --- History / tracking / dashboard --------------------------------
  console.log('\nReporting');
  const history = await api('GET', `/deliveries/${delivery1.id}/history`, { token: customerToken });
  check('status history has entries', history.status === 200 && history.body.data.length >= 5, history.body);

  const track = await api('GET', `/deliveries/track/${delivery1.trackingCode}`);
  check('public tracking works', track.status === 200 && track.body.data.id === delivery1.id);

  const dashboard = await api('GET', '/admin/dashboard', { token: adminToken });
  check('admin dashboard returns stats', dashboard.status === 200 && dashboard.body.data.users.total > 0, dashboard.body);

  // --- Suspended user cannot log in ----------------------------------
  console.log('\nAccount status');
  const suspend = await api('PATCH', `/admin/users/${otherReg.body.data.user.id}/status`, {
    token: adminToken,
    body: { status: 'SUSPENDED' },
  });
  check('admin suspends a user', suspend.status === 200 && suspend.body.data.status === 'SUSPENDED');

  const suspendedLogin = await api('POST', '/auth/login', {
    body: { email: `smoke.other.${runId}@example.com`, password: 'Customer@123' },
  });
  check('suspended user cannot log in (403)', suspendedLogin.status === 403);

  // --- Summary --------------------------------------------------------
  console.log(`\n${'-'.repeat(48)}`);
  console.log(`Passed: ${passed}   Failed: ${failed}`);
  console.log(`${'-'.repeat(48)}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
