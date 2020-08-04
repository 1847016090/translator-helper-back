const errorRequest = message => {
  return {
    status: 500,
    message
  };
};

const successRequest = (message, data) => {
  return {
    message,
    status: 200,
    data
  };
};

module.exports = {
  errorRequest,
  successRequest
};
