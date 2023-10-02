exports.success = function (req, res, message, status) {
  var response = typeof message == 'object' ? message : {data: message}
  res.status(status || 200).send(response);
}

exports.error = function (req, res, status, message) {
  console.error('[LOG-ERROR] ' + message);
  res.status(status || 500).send({
      error: message
  });
}