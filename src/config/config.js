require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    monoSignature: "whsec_1XsBotQmDRJVobVJTtI75uL9TTSwtUmSw",
    maxTimeMin: 5
}; 

module.exports = config;
