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
const redis = require('redis');
const client = redis.createClient({
    //  password: '8p2t9T8VC9qjt0B78D8RAGHU7DErV4ab',
    socket: {
        host: 'redis-10739.c8.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 10739
    },
});
var value;
client.on("error", (e) => { console.log(e); });
function set() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.set('key', 'value');
        value = yield client.get('key');
    });
}
set().then(() => { });
exports.default = client;
