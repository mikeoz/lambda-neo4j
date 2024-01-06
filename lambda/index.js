// index.js
const https = require('https');
const querystring = require('querystring');
const neo4j = require('neo4j-driver');

exports.handler = async (event) => {
    try {
        const token = await getAuthToken();
        const neo4jUri = 'neo4j+s://5159a76c.databases.neo4j.io';
        const user = 'neo4j';  // This is usually a placeholder and should be replaced or obtained securely
        const password = 'iMPDP8-5B4wYGnQRNGIBKP4M7dEoR1EJ9APqT7YiDso';  // This should be obtained securely

        const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(user, password));
        const session = driver.session();

        try {
            const personName = "Alice";  // Replace or obtain dynamically as needed
            const result = await session.run('CREATE (a:Person {name: $name}) RETURN a', { name: personName });

            const singleRecord = result.records[0];
            const node = singleRecord.get(0);
            console.log(node.properties.name); // Log the new person's name

        } finally {
            await session.close();  // Close the session
        }

        await driver.close();  // Close the driver connection

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

function getAuthToken() {
    const clientId = 'fL2FS9xHgpdKJprbNFxlJl46wUr37Zz9';  // Replace with your ClientID
    const clientSecret = '0MQSWgNZZgX0ghsCvTByrzwtZ8TLXeoNcT2FjIwmnAFz0TZENsVBgFIwdOlEr6vC';  // Replace with your Client Secret

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
