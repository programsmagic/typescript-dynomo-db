
import AWS = require('aws-sdk');
import dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

function createDynamoDBClient(): AWS.DynamoDB {
    // Set AWS credentials and region from environment variables
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    // Create and return a new DynamoDB instance
    return new AWS.DynamoDB();
}

export default createDynamoDBClient;