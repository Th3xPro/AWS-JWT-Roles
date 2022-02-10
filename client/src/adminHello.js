const jwt = require("jsonwebtoken");
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: "Hello Admin",
  };
};
