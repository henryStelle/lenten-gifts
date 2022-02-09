import { Schema, model, models, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import hash from '../utils/hash';
import crypto from 'crypto';

export interface Listing {
    name: string;
    type: string;
    isAvailable: boolean;
    title: string;
    description: string;
    meetingDays?: string;
    meetingTime?: string;
    meetingInterval?: string;
    image?: string;
    email: string;
    phone: string;
    password: string;
}

export interface ListingWithId extends Listing {
    _id: string;
}

interface ListingWithFunctions extends Listing {
    verifyPassword: (password: string) => Promise<boolean>;
}

const ListingSchema = new Schema<ListingWithFunctions>(
    {
        name: {
            required: true,
            type: String,
            minlength: 5,
            trim: true,
        },
        type: {
            required: true,
            enum: ['gift', 'group'],
            type: String,
        },
        isAvailable: {
            default: true,
            type: Boolean,
        },
        title: {
            required: true,
            type: String,
            minlength: 5,
            trim: true,
        },
        description: {
            required: true,
            type: String,
            trim: true,
        },
        meetingDays: {
            required: function isRequired(this: Listing) {
                return this.type === 'group';
            },
            type: String,
            minlength: 3,
            trim: true,
        },
        meetingTime: {
            required: function isRequired(this: Listing) {
                return this.type === 'group';
            },
            type: String,
            trim: true,
        },
        meetingInterval: {
            required: function isRequired(this: Listing) {
                return this.type === 'group';
            },
            type: String,
            trim: true,
        },
        image: String,
        email: {
            required: true,
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: (email: string) => isEmail(email),
                message: '{VALUE} is an invalid email',
            },
        },
        phone: {
            required: true,
            type: String,
            trim: true,
            set: (phone: string) =>
                phone.includes('+') ? phone : `+1 ${phone}`,
            validate: {
                validator: (phone: string) => isMobilePhone(phone),
                message: '{VALUE} is an invalid phone number',
            },
        },
        password: {
            required: true,
            type: String,
        },
    },
    {
        toObject: { versionKey: false },
    }
);

// hash the password before saving
ListingSchema.pre('save', async function () {
    if (this.isModified('password')) {
        if (this.password.length < 8) {
            throw new Error(
                'Your Password must be at least 8 characters long.'
            );
        }
        // generate random 16 bytes long salt
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await hash(this.password, salt);
        this.password = hashedPassword;
    }
});

ListingSchema.methods.verifyPassword = async function (
    password: string
): Promise<boolean> {
    const [salt, key] = this.password.split(':');
    const hashToCompare = await hash(password, salt);
    const [, compareKey] = hashToCompare.split(':');
    return compareKey === key;
};

// if the model has already been compiled, use that version, else compile for the first time (next.js issue)
const ListingModel: Model<ListingWithFunctions> =
    models.Listing || model<ListingWithFunctions>('Listing', ListingSchema);

export default ListingModel;
