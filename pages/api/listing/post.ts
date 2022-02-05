import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToMongo();
        const listing = new ListingModel(req.body);

        await listing.save();
        res.status(200).send(listing.toObject());
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
