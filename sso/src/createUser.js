const aws = require("aws-sdk");
const bcrypt = require("bcryptjs");

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  const username = body.username;
  const role = body.role ? body.role : "user";
  const password = body.password;
  const newUserParams = {
    TableName: process.env.USER_TABLE,
    Item: {
      pk: username,
      role: role,
      password: bcrypt.hashSync(password, 10),
    },
  };
  try {
    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const putResult = await dynamoDB.put(newUserParams).promise();
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Authorization",
      },
    };
  } catch (error) {
    console.log("There was an error putting the new item");
    console.log("error -> ", error);
  }
};
