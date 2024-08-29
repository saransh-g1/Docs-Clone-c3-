"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    password: 'OsfinKmjN427lypv56XbiHcy74Jd7zof',
    socket: {
        host: 'redis-17710.c11.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 17710
    }
});
client.on('error', (err) => console.log('Redis Client Error', err));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected to Redis");
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startServer();
const ex = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.set("1", "sifes");
    const value = yield client.get("5");
    console.log(value);
});
ex().then(() => { });
exports.default = client;
//# sourceMappingURL=redis.js.map