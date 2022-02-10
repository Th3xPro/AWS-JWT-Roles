const jwt = require("jsonwebtoken");
exports.handler = async (event) => {
  //Getting token
  const token = event.headers.Authorization;
  //Verifying token
  const decoded = jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET
  );
  //Checking role
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
