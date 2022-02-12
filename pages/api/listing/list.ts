import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToMongo();
        const listings =
            req.query.filter === 'false'
                ? await ListingModel.find().sort('name')
                : await ListingModel.find({ isAvailable: true }).sort('-_id');
        res.status(200).send(listings.map((listing) => listing.toObject()));
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
