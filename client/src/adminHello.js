const jwt = require("jsonwebtoken");
exports.handler = async (event) => {
  const token = event.headers.Authorization;
  const decoded = jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET
  );
  if (decoded.role !== "admin") {
    return {
      statusCode: 403,
      body: "Unauthorized",
    };
  }

  return {
    statusCode: 200,
    body: "Hello Admin",
  };
};
