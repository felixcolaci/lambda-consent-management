const { Lambda } = require("aws-sdk");

const lambda = new Lambda({
  apiVersion: "2015-03-31",
  region: "eu-central-1",
  // endpoint needs to be set only if it deviates from the default, e.g. in a dev environment
  // process.env.SOME_VARIABLE could be set in e.g. serverless.yml for provider.environment or function.environment
  // uncomment for use with sls offline
  //endpoint: "http://localhost:3002",
});

const lambdaName = (functionName) => `porta-poc-api-dev-${functionName}`;

const main = async () => {
  // create consent email
  let response = await lambda
    .invoke({
      FunctionName: lambdaName("store-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
        consentType: "email",
      }),
    })
    .promise();
  console.log(response);

  // create consent sms
  response = await lambda
    .invoke({
      FunctionName: lambdaName("store-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
        consentType: "sms",
      }),
    })
    .promise();
  console.log(response);
  // create consent letter
  response = await lambda
    .invoke({
      FunctionName: lambdaName("store-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
        consentType: "letter",
      }),
    })
    .promise();
  console.log(response);
  // revoke consent sms
  response = await lambda
    .invoke({
      FunctionName: lambdaName("revoke-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
        consentType: "sms",
      }),
    })
    .promise();
  console.log(response);
  // get users consents
  response = await lambda
    .invoke({
      FunctionName: lambdaName("get-user-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
      }),
    })
    .promise();
  console.log(response);
  // forget user
  response = await lambda
    .invoke({
      FunctionName: lambdaName("remove-user-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        userId: "123a",
      }),
    })
    .promise();
  console.log(response);

  await lambda
    .invoke({
      FunctionName: lambdaName("store-consent"),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ userId: "00u47m5zzeRX9WsMg0x7", consentType: "general" }),
    })
    .promise();
};

main();
