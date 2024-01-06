// index.js
import https from 'https';
import querystring from 'querystring';
import neo4j from 'neo4j-driver';

export async function handler(event) {
    try {
        const token = await getAuthToken();
        // Here you would use the token to authenticate and interact with Neo4j.
        // The following is a placeholder for where you would add your logic:
        const driver = neo4j.driver("your-neo4j-uri", neo4j.auth.bearer(token));
        const session = driver.session();

        try {
            // Replace the below query with your actual query logic.
            const result = await session.run('MATCH (n) RETURN n LIMIT 10');

            // Process the results of the query here.
            // For now, we'll just log the number of records found.
            console.log(`Found ${result.records.length} records.`);

        } finally {
            await session.close();
        }

        // Close the driver connection when you're finished with it.
        await driver.close();

        // Return a successful response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Query executed successfully" }),
        };

    } catch (error) {
        console.error("Error executing the Lambda function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error executing the Lambda function" }),
        };
    }
};

async function getAuthToken() {
    const clientId = 'fL2FS9xHgpdKJprbNFxlJl46wUr37Zz9'; // Replace with your ClientID
    const clientSecret = '0MQSWgNZZgX0ghsCvTByrzwtZ8TLXeoNcT2FjIwmnAFz0TZENsVBgFIwdOlEr6vC'; // Replace with your Client Secret

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const postData = querystring.stringify({ grant_type: 'client_credentials' });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.neo4j.io',
            port: 443,
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data).access_token);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}
