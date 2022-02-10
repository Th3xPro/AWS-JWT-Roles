const aws = require("aws-sdk");
const dynamoDB = new aws.DynamoDB.DocumentClient();
module.exports = dynamoDB;
