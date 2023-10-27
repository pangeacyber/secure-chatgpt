import redactText from "@/lib/redact";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.body && "message" in req.body) {
        const redactedBody = await redactText(req.body.message as string)
        if (redactedBody == false) {
            return res.status(403).json({"error": "PANGEA_TOKEN is missing"})
        }
        res.status(200).json({ message: redactedBody })
    } else {
        res.status(400).json({message: 'Bad request. Unable to redact text.'})
    }
}
