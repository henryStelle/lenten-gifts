import { connect } from 'mongoose';

export default async function connectToMongo() {
    if (!process.env.MONGO_URI) {
        throw new Error('The MONGO_URI env has not been set');
    }
    try {
        await connect(process.env.MONGO_URI);
    } catch (err) {
        console.log(err);
    }
}
