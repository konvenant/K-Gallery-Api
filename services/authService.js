
const jwt = require('jsonwebtoken');

const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.EMAIL_SECRET, { expiresIn: '24h' });
};

module.exports = { generateEmailVerificationToken };
