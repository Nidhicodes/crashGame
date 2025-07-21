const cron = require('node-cron');
const Game = require('../models/Game');
const GameStats = require('../models/GameStats');

// Schedule a job to run every day at midnight
const scheduleDailyAggregation = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily aggregation job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const games = await Game.find({
                startTime: { $gte: yesterday, $lt: today }
            });

            if (games.length === 0) {
                console.log('No games to aggregate for yesterday.');
                return;
            }

            const stats = aggregateStats(games);
            await GameStats.create({ ...stats, period: 'daily', date: yesterday });
            console.log('Daily aggregation complete.');
        } catch (error) {
            console.error('Error during daily aggregation:', error);
        }
    });
};

// Schedule a job to run every Monday at 1 AM
const scheduleWeeklyAggregation = () => {
    cron.schedule('0 1 * * 1', async () => {
        console.log('Running weekly aggregation job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);

            const games = await Game.find({
                startTime: { $gte: lastWeek, $lt: today }
            });

            if (games.length === 0) {
                console.log('No games to aggregate for the last week.');
                return;
            }

            const stats = aggregateStats(games);
            await GameStats.create({ ...stats, period: 'weekly', date: lastWeek });
            console.log('Weekly aggregation complete.');
        } catch (error) {
            console.error('Error during weekly aggregation:', error);
        }
    });
};

const aggregateStats = (games) => {
    const totalGames = games.length;
    const totalPlayers = games.reduce((sum, game) => sum + game.totalPlayers, 0);
    const totalBets = games.reduce((sum, game) => sum + game.totalBets, 0);
    const totalWinnings = games.reduce((sum, game) => {
        return sum + game.participants.reduce((winnings, p) => winnings + p.winnings, 0);
    }, 0);
    const netProfit = totalBets - totalWinnings;
    const highestMultiplier = Math.max(...games.map(g => g.crashMultiplier));
    const averageMultiplier = games.reduce((sum, g) => sum + g.crashMultiplier, 0) / totalGames;

    return {
        totalGames,
        totalPlayers,
        totalBets,
        totalWinnings,
        netProfit,
        highestMultiplier,
        averageMultiplier,
    };
};

module.exports = {
    scheduleDailyAggregation,
    scheduleWeeklyAggregation,
};
