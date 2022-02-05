import { Schema, model, models, Model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";

export interface Listing {
  name: string;
  type: string;
  isAvailable: boolean;
  title: string;
  description: string;
  image?: string;
  email: string;
  phone: string;
}

const ListingSchema = new Schema<Listing>({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  type: {
    required: true,
    enum: ["gifts", "groups"],
    type: String,
  },
  isAvailable: {
    default: true,
    type: Boolean,
  },
  title: {
    required: true,
    type: String,
    trim: true,
  },
  description: {
    required: true,
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
      message: "{VALUE} is an invalid email",
    },
  },
  phone: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (email: string) => isMobilePhone(email),
      message: "{VALUE} is an invalid phone number",
    },
  },
});

// if the model has already been compiled, use that version, else compile for the first time (next.js issue)
const ListingModel: Model<Listing> =
  models.Listing || model<Listing>("Listing", ListingSchema);

export default ListingModel;
