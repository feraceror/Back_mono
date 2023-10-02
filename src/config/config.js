require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    monoSignature: "whsec_1LZXJSDVuM47hBHr78gCrrfubRYmezum0",
    maxTimeMin: 5
}; 

module.exports = config;