const Joi = require('joi');

const validateWalletAddress = (req, res, next) => {
  const schema = Joi.object({
    walletAddress: Joi.string().length(42).pattern(/^0x[a-fA-F0-9]{40}$/).required()
  });

  const { error } = schema.validate({ walletAddress: req.params.walletAddress });
  if (error) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }
  next();
};

const validateGameResult = (req, res, next) => {
  const schema = Joi.object({
    gameId: Joi.string().required(),
    betAmount: Joi.number().positive().required(),
    targetMultiplier: Joi.number().positive().optional(),
    cashedOutAt: Joi.number().positive().optional().allow(null),
    cashedOutTime: Joi.date().optional().allow(null),
    winnings: Joi.number().min(0).required(),
    won: Joi.boolean().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateWalletAddress,
  validateGameResult
};