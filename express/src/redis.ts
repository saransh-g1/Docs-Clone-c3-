import { createClient } from "redis";


const client = createClient({
   password: process.env.Pass,
    socket: {
        host: process.env.host,
        port: Number(process.env.port)
    }});
client.on('error', (err) => console.log('Redis Client Error', err));


async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");


    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();

const ex=async()=>{
   await client.set("1","sifes")

    const value=await client.get("5")
    console.log(value);
}

ex().then(()=>{});

export default client