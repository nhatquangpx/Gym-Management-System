const cron = require('node-cron');
const Schedule = require('../models/Schedule');

// Run at 00:01 AM every day
const updateMissedSchedules = cron.schedule('1 0 * * *', async () => {
  try {
    console.log('Running schedule update cron job...');
      
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    // Find and update all schedules from yesterday that weren't attended
    const result = await Schedule.updateMany(
      {
        date: {
          $lt: new Date().setHours(0, 0, 0, 0), 
          $gte: yesterday
        },
        status: { $eq: 'Chưa tập' }
      },
      {
        $set: { status: 'Vắng mặt' }
      }
    );
    console.log(`Updated ${result.modifiedCount} schedules to 'Vắng mặt'`);
  } catch (error) {
    console.error('Error in schedule update cron:', error);
  }
});

module.exports = updateMissedSchedules;