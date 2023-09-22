import auditLog from '@/lib/auditLog'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.body) {
        await auditLog({...req.body})
        res.status(200).json({ message: "sucess" })
    } else {
        res.status(400).json({message: 'Bad request. Unable to log message.'})
    }
}
