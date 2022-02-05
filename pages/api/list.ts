import type { NextApiRequest, NextApiResponse } from "next";
import gifts from "../../gifts.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  setTimeout(() => {
    res.status(200).json(gifts);
  }, 1000);
};
