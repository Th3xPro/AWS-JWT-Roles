const jwt = require("jsonwebtoken");
module.exports.validate = async (event, context) => {
  //Getting token
  console.log(event);
  const authorizerToken = event.authorizationToken;
  const authorizerArr = authorizerToken.split(" ");
  const token = authorizerArr[1];

  if (
    authorizerArr.length !== 2 ||
    authorizerArr[0] !== "Bearer" ||
    authorizerArr[1].length === 0
  ) {
    return generatePolicy("undefined", "Deny", event.methodArn);
  }

  //Verifying token
  let decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

  if (
    typeof decodedJwt.username !== "undefined" &&
    decodedJwt.username.length > 0
  ) {
    if (event.methodArn.includes("Admin") && decodedJwt.role === "admin") {
      return generatePolicy(decodedJwt.username, "Allow", event.methodArn);
    }
    if (event.methodArn.includes("User")) {
      return generatePolicy(decodedJwt.username, "Allow", event.methodArn);
    }
  }
  return generatePolicy("undefined", "Deny", event.methodArn);
};

const generatePolicy = function (principalId, effect, resource) {
  let authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};
