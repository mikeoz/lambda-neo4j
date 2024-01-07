// index.js
const neo4j = require('neo4j-driver');

exports.handler = async (event) => {
    const uri = 'neo4j+s://5159a76c.databases.neo4j.io';
    const user = 'neo4j';
    const password = 'iMPDP8-5B4wYGnQRNGIBKP4M7dEoR1EJ9APqT7YiDso';

    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    try {
        // Parse the incoming data
        const data = JSON.parse(event.body);
        const { person_id, first_name, middle_name, last_name } = data;

        // Create a new person node
        const result = await session.run(
            'CREATE (p:Person {person_id: $person_id, first_name: $first_name, middle_name: $middle_name, last_name: $last_name}) RETURN p',
            { person_id, first_name, middle_name, last_name }
        );

        await session.close();
        await driver.close();

        // If no records are created, return a different message
        if (result.records.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No new person was added" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "New Person Added" }),
        };

    } catch (error) {
        console.error("Error executing the Lambda function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error executing the Lambda function" }),
        };
    }
};
