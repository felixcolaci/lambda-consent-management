"use strict";
const { DynamoDB } = require("aws-sdk");

const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

module.exports.handler = async ({ userId }) => {
  try {
    const consents = await db
      .query({
        TableName,
        KeyConditionExpression: "#kn0 = :kv0",
        ExpressionAttributeNames: { "#kn0": "user_id" },
        ExpressionAttributeValues: {
          ":kv0": userId,
        },
      })
      .promise();
    return consents?.Items;
  } catch (error) {
    console.log(error);
    throw new Error(`no consent found for ${userId}.`);
  }
};
