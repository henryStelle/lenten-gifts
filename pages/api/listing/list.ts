import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('initialing connection');
        await connectToMongo();
        console.log('connection happened');
        const listings = await ListingModel.find({ isAvailable: true });
        console.log('retried', listings.length, 'listings');
        res.status(200).send(listings.map((listing) => listing.toObject()));
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
