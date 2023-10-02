const key = require('../../../utils/credentials');
const CircularJSON = require('circular-json');
const IO = require('../external/IO');
const logger = require('../../../utils/logger');


const getBanks = () => {

  return new Promise((resolve, reject) => {
    try {
      var url = 'https://api.sandbox.cuentamono.com/v1/banks'

      IO.query(null,url,'GET','Bearer ' + key, null).then((r)=>{
        const strResp = CircularJSON.stringify(r);
        const resp = JSON.parse(strResp);
        resolve(resp ? resp.data : {});
      })
      .catch((err)=>{
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

const createTransfer = (request) => {

  return new Promise((resolve, reject) => {
    try {
      var url = 'https://api.sandbox.cuentamono.com/v1/transfers'
      console.log(CircularJSON.stringify(request.body));
      var payload = request.body ?? {}
      IO.query(payload,url,'POST','Bearer ' + key, null).then((r)=>{
        const strResp = CircularJSON.stringify(r);
        const resp = JSON.parse(strResp);
        resolve(resp ? resp.data : {});
      })
      .catch((err)=>{
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  createTransfer,
  getBanks
}