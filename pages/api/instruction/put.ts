import type { NextApiRequest, NextApiResponse } from 'next';
import InstructionModel from '../../../models/Instruction';
import connectToMongo from '../../../utils/connectToMongo';

export default async function put(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = req.body._id;
        if (!id) throw new Error('Instruction Id required.');
        await connectToMongo();
        const instruction = await InstructionModel.findById(id);

        if (instruction) {
            Object.entries(req.body).forEach(([key, value]) => {
                instruction.set(key, value);
            });
            await instruction.save({ validateBeforeSave: true });
            res.status(200).send(instruction.toObject());
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
