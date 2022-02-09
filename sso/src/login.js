const bcrypt = require("bcryptjs");
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");

module.exports.login = async (event, context) => {
  const body = JSON.parse(event.body);

  const queryUserParams = {
    TableName: process.env.USER_TABLE,
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
      "#username": "pk",
    },
    ExpressionAttributeValues: {
      ":username": body.username,
    },
  };
  let userResult = {};
  try {
    const dynamoDB = new aws.DynamoDB.DocumentClient();
    userResult = await dynamoDB.query(queryUserParams).promise();
  } catch (error) {
    console.log("There was an error attempting to retrieve the user");
    console.log("queryError", error);
  }
  if (
    typeof userResult.Items !== "undefined" &&
    userResult.Items.length === 1
  ) {
    const compareResult = bcrypt.compareSync(
      body.password,
      userResult.Items[0].password
    );
    if (compareResult) {
      let token = jwt.sign(
        {
          username: userResult.Items[0].pk,
          role: userResult.Items[0].role,
        },
        process.env.JWT_SECRET
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          token: token,
        }),
      };
    }
  }
};
