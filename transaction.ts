import createDynamoDBClient from './configs/dynamoDB';

const dynamoDB = createDynamoDBClient();

interface TransactionInput {
    idempotentKey: string;
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
}

async function processTransaction(input: TransactionInput): Promise<void> {
    const { idempotentKey, userId, amount, type } = input;

    const updateParams = {
        TableName: 'UserBalances',
        Key: { 'userId': { S: userId } },
        UpdateExpression: type === 'credit' ? 'SET balance = balance + :val' : 'SET balance = balance - :val',
        ExpressionAttributeValues: {
            ':val': { N: String(Math.abs(amount)) }
        },
        ConditionExpression: type === 'debit' ? 'balance >= :val' : null, // Check if balance is sufficient for debit
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await dynamoDB.updateItem(updateParams as AWS.DynamoDB.DocumentClient.UpdateItemInput).promise();
        console.log(`Transaction successful for user ${userId}: ${type} ${amount}`);
    } catch (error) {
        if ((error as any).code === 'ConditionalCheckFailedException') {
            console.error(`Insufficient balance for user ${userId} to perform ${type} transaction`);
            throw new Error(`Insufficient balance for user ${userId} to perform ${type} transaction`);
        } else {
            console.error("Error processing transaction:", error);
            throw new Error("Error processing transaction");
        }
    }
}

export default processTransaction;
