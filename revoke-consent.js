"use strict";
const { DynamoDB } = require("aws-sdk");

const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

module.exports.handler = async ({ userId, consentType }) => {
  try {
    const response = await db
      .query({
        TableName,
        ReturnConsumedCapacity: "TOTAL",
        Limit: 50,
        KeyConditionExpression: "#kn0 = :kv0 AND #kn1 = :kv1",
        ExpressionAttributeNames: {
          "#kn0": "user_id",
          "#kn1": "consent",
        },
        ExpressionAttributeValues: {
          ":kv0": userId,
          ":kv1": consentType,
        },
      })
      .promise();
    if (response.Count > 0) {
      response.Items[0].granted = false;
      response.Items[0].updated_at = new Date().toISOString();
      await db
        .put({
          TableName,
          Item: response.Items[0],
        })
        .promise();
      return response.Items[0];
    }
    throw new Error("not found");
  } catch (error) {
    throw new Error(`consent ${consentType} was not granted by ${userId} before.`);
  }
};
