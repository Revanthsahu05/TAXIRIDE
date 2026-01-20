const cron = require('node-cron');
const captainModel = require('../models/captain-model');

const cleanConsole = () => {
    // Helper to keep console clean if needed, or just log clearly
    console.log(`[CRON] Running scheduled maintenance...`);
};

const initializeCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Daily Reset at Midnight (00:00)
    // Resets 'today' earnings and rides to 0
    cron.schedule('0 0 * * *', async () => {
        try {
            cleanConsole();
            console.log("Running Daily Reset for Captains...");
            await captainModel.updateMany({}, {
                $set: {
                    "earnings.today": 0,
                    "rides.today": 0
                }
            });
            console.log("Daily stats reset successfully.");
        } catch (err) {
            console.error("Error in daily reset cron:", err);
        }
    });

    // Monthly Reset at Midnight on the 1st of every month
    // Resets 'monthly' earnings and rides to 0
    cron.schedule('0 0 1 * *', async () => {
        try {
            console.log("Running Monthly Reset for Captains...");
            await captainModel.updateMany({}, {
                $set: {
                    "earnings.monthly": 0,
                    "rides.monthly": 0
                }
            });
            console.log("Monthly stats reset successfully.");
        } catch (err) {
            console.error("Error in monthly reset cron:", err);
        }
    });
};

module.exports = initializeCronJobs;
