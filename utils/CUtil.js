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

const judgeType = (data) => {
  return Object.prototype.toString.call(data).slice(8, -1);
};

String.prototype.format = function (obj) {
  var str = this;
  var newStr = str;
  if (judgeType(obj) === "Object" && JSON.stringify(obj) !== "{}") {
    Object.entries(obj).forEach((module) => {
      const [key, value] = module;
      newStr = newStr.replace(`{${key}}`, value);
    });
  }
  return newStr;
};

module.exports = {
  errorRequest,
  successRequest
};
