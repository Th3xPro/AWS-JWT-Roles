const bcrypt = require("bcryptjs");
const dynamoDB = require("../utils/dynamoUtils");
const jwt = require("jsonwebtoken");

module.exports.login = async (event, context) => {
  //Parsing event
  const body = JSON.parse(event.body);

  //Setting data to query dynamo
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
    userResult = await dynamoDB.query(queryUserParams).promise();
    //Chcecking if user exists
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
  } catch (error) {
    console.log("There was an error attempting to retrieve the user");
    console.log("queryError", error);
    return {
      statusCode: 204,
      body: "There was an error attempting to retrieve the user",
    };
  }
};
