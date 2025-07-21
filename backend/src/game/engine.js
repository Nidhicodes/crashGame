const mongoose = require('mongoose');
const { clearInterval } = require('timers');
const Game = require('../models/Game');
const { broadcast } = require('../websockets');

const TICK_RATE = 1000;
const CRASH_PROBABILITY = 0.01;

let tick = 0;
let multiplier = 1;
let gameRunning = false;
let gameLoop;
let currentGame;

const startGameLoop = () => {
    gameRunning = true;
    multiplier = 1;
    tick = 0;

    currentGame = new Game({
        gameId: new mongoose.Types.ObjectId().toString(),
        startTime: new Date(),
        crashMultiplier: 0,
        crashTime: null,
        endTime: null,
        participants: [],
    });

    gameLoop = setInterval(() => {
        tick++;
        multiplier += 0.01 * tick;

        // Emit game state to all clients
        broadcast({ type: 'gameState', payload: { multiplier, gameRunning } });

        if (Math.random() < CRASH_PROBABILITY) {
            endGame();
        }
    }, TICK_RATE);
};

const endGame = async () => {
    gameRunning = false;
    clearInterval(gameLoop);

    currentGame.crashMultiplier = multiplier;
    currentGame.crashTime = new Date();
    currentGame.endTime = new Date();

    await currentGame.save();

    broadcast({ type: 'crash', payload: { multiplier } });

    // Start a new game after a delay
    setTimeout(startGameLoop, 5000);
};

const getGameState = () => {
    return {
        multiplier,
        gameRunning,
        startTime: currentGame ? currentGame.startTime : null,
    };
};

module.exports = {
    startGameLoop,
    getGameState,
};
