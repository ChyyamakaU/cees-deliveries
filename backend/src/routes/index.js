const express = require('express');

const authRoutes = require('./authRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const riderRoutes = require('./riderRoutes');
const paymentRoutes = require('./paymentRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "Cee's Deliveries API is running",
    data: { timestamp: new Date().toISOString(), uptime: process.uptime() },
  });
});

router.use('/auth', authRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/rider', riderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
