import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB();

interface TransactionInput {
    idempotentKey: string;
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
}

async function processTransaction(input: TransactionInput): Promise<void> {
    // Implement transaction processing logic
    // For simplicity, let's assume the transaction is always successful and update the balance directly in DynamoDB
    const { idempotentKey, userId, amount, type } = input;

    const updateParams = {
        TableName: 'UserBalances',
        Key: { 'userId': { S: userId } },
        UpdateExpression: type === 'credit' ? 'SET balance = balance + :val' : 'SET balance = balance - :val',
        ExpressionAttributeValues: {
            ':val': { N: String(Math.abs(amount)) }
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await dynamoDB.updateItem(updateParams).promise();
        console.log(`Transaction successful for user ${userId}: ${type} ${amount}`);
    } catch (error) {
        console.error("Error processing transaction:", error);
        throw new Error("Error processing transaction");
    }
}

export default processTransaction;
