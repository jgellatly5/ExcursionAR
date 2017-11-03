import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

export function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  };
