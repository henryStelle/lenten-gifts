import type { NextApiRequest, NextApiResponse } from 'next';
import InstructionModel from '../../../models/Instruction';
import connectToMongo from '../../../utils/connectToMongo';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToMongo();
        const instructions = await InstructionModel.find();
        if (instructions.length) {
            res.status(200).send(
                instructions.map((instruction) => instruction.toObject())
            );
        } else {
            res.status(404).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}
