import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB();

interface RetrieveBalanceInput {
    userId: string;
}

async function retrieveCurrentBalance(input: RetrieveBalanceInput): Promise<number> {
    const { userId } = input;

    // Simulated logic to retrieve transactions from DynamoDB table
    const params = {
        TableName: 'Transactions',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': { S: userId }
        }
    };

    try {
        const data = await dynamoDB.query(params).promise();
        if (data && data.Items) {
            let balance = 0;
            data.Items.forEach((item) => {
                const amount = parseInt(item.amount.N || '0');
                if (item.type.S === 'credit') {
                    balance += amount;
                } else if (item.type.S === 'debit') {
                    balance -= amount;
                }
            });
            return balance;
        } else {
            // If no transactions found, return 0 balance
            return 0;
        }
    } catch (error) {
        console.error("Error retrieving balance:", error);
        throw new Error("Error retrieving balance");
    }
}

export default retrieveCurrentBalance;
