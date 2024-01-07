import https from 'https';
import querystring from 'querystring';
import neo4j from 'neo4j-driver';

export async function handler(event) {
    // Hardcoded information for testing purposes
    const neo4jUri = 'neo4j+s://5159a76c.databases.neo4j.io';
    const user = 'neo4j';
    const password = 'iMPDP8-5B4wYGnQRNGIBKP4M7dEoR1EJ9APqT7YiDso';

    // Create a driver instance, for the user neo4j with password obtained from an environment variable
    const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(user, password));

    // Create a session to interact with the database
    const session = driver.session();

    try {
        // Write the logic to send data to Neo4j here.
        // This is a sample query to create a new person in the database.
        const personName = "Alice"; // Replace with dynamic data if necessary
        const result = await session.run(
            'CREATE (a:Person {name: $name}) RETURN a',
            { name: personName }
        );

        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        console.log(node.properties.name); // Log the new person's name
    } finally {
        await session.close(); // Close the session
    }

    // Close the driver connection when you're finished with it
    await driver.close();
};
