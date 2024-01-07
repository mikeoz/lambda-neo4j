// index.js
const neo4j = require('neo4j-driver');

exports.handler = async (event) => {
    // Set your Neo4j connection credentials
    const uri = 'neo4j+s://5159a76c.databases.neo4j.io';
    const user = 'neo4j';
    const password = 'iMPDP8-5B4wYGnQRNGIBKP4M7dEoR1EJ9APqT7YiDso';

    // Connect to the Neo4j database
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();

    try {
        // Parse the incoming data
        const data = JSON.parse(event.body);
        const { person_id, first_name, middle_name, last_name } = data;

        // Run a Cypher query to create a new person node
        const result = await session.run(
            'CREATE (p:Person {person_id: $person_id, first_name: $first_name, middle_name: $middle_name, last_name: $last_name}) RETURN p',
            { person_id, first_name, middle_name, last_name }
        );

        await session.close();
        await driver.close();

        // Check if a new node was created
        if (result.records.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No new person was added" }),
            };
        }

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "New Person Added" }),
        };

    } catch (error) {
        console.error("Error executing the Lambda function:", error);
        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error executing the Lambda function", error: error.message }),
        };
    }
};
