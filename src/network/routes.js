
const mono = require('../components/business/mono/network')

const routes = (server) => {
  // Api Version 1
  server.use('/api/v1/mono', mono);
}

module.exports = routes