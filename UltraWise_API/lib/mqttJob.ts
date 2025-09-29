// import mqtt from "mqtt";
// import nodeCron from "node-cron";
// import ultraSonic from "../src/schema/footprint.schema";

// export const mqttServer = () => {
//     console.log("...running")
//      const client = mqtt.connect("mqtts://b890de781a384ca5974549b128d23408.s1.eu.hivemq.cloud:8883",{
//             username:"Ultrawise",
//             password:"Ultrawise001"
//     })

//     client.on("error", (error) => {
//             console.log("didn't connect")
//             console.log(error)
//         })
//         client.on("connect",() => {
//             console.log("connected to MQTT")
//             client.subscribe("data_center/sensor/001")
//         })

//     nodeCron.schedule("0 * * * *", async () => {
//         console.log("fetching MQTT data...")
//          client.on("message", async (topic,message) => {
//             console.log("message successfully gotten")
//             console.log(message)
//             try {
//                 const payLoad = JSON.parse(message.toString())
//                 const db = await ultraSonic.create({
//                  height: payLoad.height,
//                 Timestamp: new Date(payLoad.Timestamp),
//                 })
//                 console.log(db)
//             } catch (error) {
//                 if(error){
//                     console.log(error)
//                     console.log('an error occured, couldnt run cron job')
//                 }
//             }
//         })
//     })
// }

import mqtt from "mqtt";
import nodeCron from "node-cron";
import ultraSonic from "../src/schema/footprint.schema";

// 1. Storage for the messages received during the hour
const messageBuffer : any[] = [];

export const mqttServer = () => {
    console.log("...running");
    
    // Connect to MQTT
    const client = mqtt.connect("mqtts://b890de781a384ca5974549b128d23408.s1.eu.hivemq.cloud:8883", {
        username: "Ultrawise",
        password: "Ultrawise001"
    });

    client.on("error", (error) => {
        console.log("MQTT Connection Error:");
        console.log(error);
    });

    client.on("connect", () => {
        console.log("Connected to MQTT");
        client.subscribe("data_center/sensor/001");
    });

    // 2. Continuous Listener (Outside of Cron)
    // This runs every time a message is received (every second)
    client.on("message", (topic, message) => {
        try {
            const payLoad = JSON.parse(message.toString());
            
            // Add the received data to the buffer
            messageBuffer.push({
                height: payLoad.height,
                Timestamp: new Date(payLoad.Timestamp)
            });
            // console.log(`Buffered message. Current buffer size: ${messageBuffer.length}`);
            
        } catch (error) {
            console.error('Error parsing MQTT message:', error);
        }
    });

    // 3. Cron Job (Runs every hour at the start of the hour - "0 * * * *")
    nodeCron.schedule("* * * * *", async () => {
        console.log("--- Hourly Cron Job Running ---");
        
        // 3a. Check if there is data to process
        if (messageBuffer.length === 0) {
            console.log("No messages received this hour. Skipping database write.");
            return;
        }

        // 3b. Process the buffered data (Calculate the average height)
        const totalHeight = messageBuffer.reduce((sum, data) => sum + parseFloat(data.height), 0);
        const averageHeight = totalHeight / messageBuffer.length;
        
        console.log(`Processing ${messageBuffer.length} messages.`);
        console.log(`Hourly Average Height: ${averageHeight.toFixed(2)}`);

        try {
            // 3c. Save the hourly average to the database
            const db = await ultraSonic.create({
                // Saving the calculated hourly average
                height: averageHeight.toFixed(2), 
                // Using the time the cron job ran as the timestamp
                Timestamp: new Date(), 
                messageCount: messageBuffer.length 
            });
            
            console.log("Hourly data successfully saved to DB.");
            // console.log(db);
            
        } catch (error) {
            console.error('Database save error in cron job:', error);
        }
        
        // 3d. Clear the buffer for the next hour
        messageBuffer.length = 0; 
        console.log("Buffer cleared. Ready for next hour.");
    });
}