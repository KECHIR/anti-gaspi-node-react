"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbConfig = void 0;
exports.mongoDbConfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //FROM SERVER
    minPoolSize: 3,
    // poolSize: poolSize, //default poolSize for new server instances --> how do I determine the optimal pool size?
    //reconnectTries: 60 * 60,  //Number.MAX_VALUE à mettre éventuellement...
    //reconnectInterval: 1000,
    //FROM socketOptions
    keepAlive: true,
    // keepAlive: 5000,
    connectTimeoutMS: 3600000,
    socketTimeoutMS: 180000,
    //FROM replset
    // socketOptions: socketOptions,
    //socketOptions: socketOptions,
    //poolSize : poolSize,
    // ha: true, //turn on high availability --> I still have to test this, but so far its looking promising.
    // haInterval: 5000, //time between each replicaset status check
};
