import type { NextApiRequest, NextApiResponse } from 'next';
import InstructionModel from '../../../models/Instruction';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.query.type) throw new Error('Instruction type required.');

        await connectToMongo();
        const instruction = await InstructionModel.findOne({
            type: req.query.type,
        });
        if (instruction) {
            res.status(200).send(instruction.toObject());
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
