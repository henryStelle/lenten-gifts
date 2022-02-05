import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.query.id) throw new Error('Listing Id required.');
        await connectToMongo();
        const listing = await ListingModel.findById(req.query.id);
        if (listing) {
            // setTimeout(() => res.status(200).send(listing.toObject()), 5000);
            res.status(200).send(listing.toObject());
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
