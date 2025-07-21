const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateWalletAddress } = require('../middleware/validation');

// Register or login a user
router.post('/', async (req, res) => {
  const { walletAddress, username } = req.body;

  if (!walletAddress) return res.status(400).json({ error: 'Wallet address required' });

  try {
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, username });
      await user.save();
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('User create/login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stats
router.get('/:walletAddress', validateWalletAddress, async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      walletAddress: user.walletAddress,
      username: user.username,
      stats: user.stats,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// Update username or stats
router.put('/:walletAddress', validateWalletAddress, async (req, res) => {
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { walletAddress: req.params.walletAddress },
      { $set: updates },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
