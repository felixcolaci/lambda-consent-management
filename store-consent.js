"use strict";
const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const ddb = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;

module.exports.handler = async ({ userId, consentType }) => {
  const newConsent = {
    user_id: userId,
    consent: consentType,
    granted: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const response = await ddb
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
      const existingConsent = response.Items[0];
      newConsent.created_at = existingConsent.created_at || new Date().toISOString();
    }
  } catch (e) {
    console.log(e);
  } finally {
    try {
      const response = await ddb
        .put({
          TableName,
          Item: newConsent,
        })
        .promise();
      return newConsent;
    } catch (error) {
      console.log(error);
      throw new Error(`failed to store consent`);
    }
  }
};
