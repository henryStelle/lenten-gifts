import { Schema, model, models, Model } from 'mongoose';

export interface Instruction {
    text: string;
}

export interface InstructionWithId extends Instruction {
    _id: string;
}

const InstructionSchema = new Schema<Instruction>(
    {
        text: {
            type: String,
            required: true,
        },
    },
    {
        toObject: { versionKey: false },
    }
);

// if the model has already been compiled, use that version, else compile for the first time (next.js issue)
const InstructionModel: Model<Instruction> =
    models.Instructions ||
    model<Instruction>('Instructions', InstructionSchema);

export default InstructionModel;
