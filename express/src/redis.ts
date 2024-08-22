const redis=require('redis')

const client = redis.createClient({
  //  password: '8p2t9T8VC9qjt0B78D8RAGHU7DErV4ab',
    socket: {
        host: 'redis-10739.c8.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10739
    },
});
var value;
client.on("error",(e:any)=>{console.log(e)});
async function set (){
    await client.set('key', 'value');
     value = await client.get('key');
}
set().then(()=>{})
export default client