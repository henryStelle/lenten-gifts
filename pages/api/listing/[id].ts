import type { NextApiRequest, NextApiResponse } from 'next';
import ListingModel from '../../../models/Listing';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.query.id) throw new Error('Listing Id required.');
        if (!req.headers.authorization)
            throw new Error('Authentication required.');

        const password = Buffer.from(
            req.headers.authorization.substring(6),
            'base64'
        )
            .toString('utf-8')
            .substring(1);
        await connectToMongo();
        const listing = await ListingModel.findById(req.query.id);
        if (listing) {
            const valid = await listing.verifyPassword(password);
            if (valid) {
                res.status(200).send(listing.toObject());
            } else {
                res.status(403).send({ message: 'Invalid password' });
            }
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
