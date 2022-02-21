import { Schema, model, models, Model } from 'mongoose';

export interface Instruction {
    type: 'group' | 'gift';
    text: string;
}

export interface InstructionWithId extends Instruction {
    _id: string;
}

const InstructionSchema = new Schema<Instruction>(
    {
        type: {
            type: String,
            enum: ['group', 'gift'],
            lowercase: true,
            required: true,
        },
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
