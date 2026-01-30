import type { NextApiRequest, NextApiResponse } from 'next';
import InstructionModel from '../../../models/Instruction';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToMongo();
        const instruction = await InstructionModel.findOne().sort({ _id: 1 });
        if (instruction) {
            res.status(200).send([instruction.toObject()]);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
