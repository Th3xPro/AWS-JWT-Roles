const bcrypt = require("bcryptjs");
const dynamoDB = require("../utils/dynamoUtils");

module.exports.createUser = async (event, context) => {
  //Parsing event
  const body = JSON.parse(event.body);

  //Getting user data
  const username = body.username;
  const role = body.role ? body.role : "user";
  const password = body.password;

  //Setting data to dynamo
  const newUserParams = {
    TableName: process.env.USER_TABLE,
    Item: {
      pk: username,
      role: role,
      password: bcrypt.hashSync(password, 10),
    },
  };
  try {
    const putResult = await dynamoDB.put(newUserParams).promise();
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Authorization",
      },
      body: "Success",
    };
  } catch (error) {
    console.log("There was an error putting the new item");
    console.log("error -> ", error);
  }
};
