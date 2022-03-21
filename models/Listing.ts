import { Schema, model, models, Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

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
    vaccinationRequired: boolean;
}

export interface ListingWithId extends Listing {
    _id: string;
}

const ListingSchema = new Schema<Listing>(
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
            get: (phone: string) => {
                const numbers = phone.replace(/[^0-9]/g, '');

                // not an international north american phone number
                if (11 != numbers.length) {
                    return phone;
                }

                const prefix = '+ ' + numbers.charAt(0);
                const areaCode = numbers.substring(1, 4);
                const firstPart = numbers.substring(4, 7);
                const lastPart = numbers.substring(7);

                return [prefix, areaCode, firstPart, lastPart].join(' ');
            },
            validate: {
                validator: (phone: string) =>
                    isMobilePhone(phone.replace(/[^+0-9]/g, '')),
                message: '{VALUE} is an invalid phone number',
            },
        },
        vaccinationRequired: Boolean,
    },
    {
        toObject: { versionKey: false, getters: true },
    }
);

// if the model has already been compiled, use that version, else compile for the first time (next.js issue)
const ListingModel: Model<Listing> =
    models.Listing || model<Listing>('Listing', ListingSchema);

Schema.Types.Boolean.convertToFalse.add('false');
Schema.Types.Boolean.convertToTrue.add('true');

export default ListingModel;
