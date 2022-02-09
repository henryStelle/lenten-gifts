import type { NextApiRequest, NextApiResponse } from 'next';

export default async function list(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (typeof req.query.title == 'string' && req.query.title.length > 4) {
            const response = await fetch(
                `https://api.pexels.com/v1/search?size=small&query=${encodeURIComponent(
                    req.query.title
                )}&per_page=6&orientation=landscape`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PEXELS_API_KEY}`,
                    },
                }
            );
            if (!response.ok) {
                res.status(500).end();
            } else {
                const data = await response.json();
                res.status(200).send(data);
            }
        } else {
            res.status(400).send({
                message: 'Missing title parameter of at least 5 characters.',
            });
        }
    } catch (err) {
        res.status(500).end();
    }
}
