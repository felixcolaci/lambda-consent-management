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
    for (const item of consents.Items) {
      await db
        .delete({
          TableName,
          Key: {
            user_id: userId,
            consent: item.consent,
          },
        })
        .promise();
    }
  } catch (error) {
    console.log(error);
  }
};
