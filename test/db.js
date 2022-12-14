const {
    MongoMemoryServer
} = require('mongodb-memory-server');
const {
    default: mongoose
} = require('mongoose');
let mongod;
exports.createDB = async () => {
    mongod = await MongoMemoryServer.create();
    const url = mongod.getUri();
    await mongoose.connect(url);
}
exports.clearDB = async () => {
    const data = await mongoose.connection.collections;
    for (let collections in data) {
        const collection = data[collections];
        await collection.deleteMany();
    }
}
exports.closeDB = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close();
    if (mongod) {
        mongod.stop();
    }
}