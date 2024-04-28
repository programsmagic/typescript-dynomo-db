import retrieveCurrentBalance from './balance';
import processTransaction from './transaction';

async function test() {
    try {

        //we have added the 100 balance to the user 1 when user was created as a default balance
        await processTransaction({ idempotentKey: '0', userId: '1', amount: 100, type: 'credit' }); // Added transaction for default balance


        // Test Retrieve Balance Function
        const initialBalance = await retrieveCurrentBalance({ userId: '1' });
        console.log("Initial Balance:", initialBalance);//100 balance is added to the user 1 when user was created as a default balance

        // Test Transaction Function
        await processTransaction({ idempotentKey: '1', userId: '1', amount: 50, type: 'credit' });
        await processTransaction({ idempotentKey: '2', userId: '1', amount: 20, type: 'debit' });
        await processTransaction({ idempotentKey: '3', userId: '1', amount: 200, type: 'credit' });
        await processTransaction({ idempotentKey: '4', userId: '1', amount: 150, type: 'debit' });

        // Retrieve final balance
        const finalBalance = await retrieveCurrentBalance({ userId: '1' });
        console.log("Final Balance:", finalBalance);    //230 balance after calculating the transactions
    } catch (error) {
        console.error("Error in test function:", error);
    }
}

test();
