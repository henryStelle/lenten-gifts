import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = req.body._id;
        if (!id) throw new Error('Listing Id required.');
        await connectToMongo();
        const listing = await ListingModel.findById(id);

        if (listing) {
            Object.entries(req.body).forEach(([key, value]) => {
                listing.set(key, value);
            });
            await listing.save({ validateBeforeSave: true });
            res.status(200).send(listing.toObject());
        } else {
            res.status(404).send({
                message: 'This document does not exist',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}
