/** @format */

import { NextApiRequest, NextApiResponse } from 'next'
import Product from '../../../../../models/Data/Product'
import db from '../../../../../utils'

const admin = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === 'POST') {
			const { aydi } = req.query
			const { authType, data, action } = req.body
			if (authType === '^A*d&m%i$NB#I$N@s*e&R%t!') {
				await db.connectToShop()
				if (action === '(*I&n%s$E#r@t^O&n*E(') {
					const insert = await Product.create(data)
					res.status(200).json({ success: true })
				} else if (action === '*U)p(d&a^t%e^O&n@e%A^d&M^i*n(') {
					if (aydi && aydi.length > 0) {
						;(await Product.findOneAndUpdate({ _id: aydi }, data))
							? res.status(200).json({ success: true })
							: res.status(401).json({ success: false })
					} else {
						res.status(402).json({ success: false })
					}
				} else if (action === 'd)e*L(e&T^e*O&n^e$o%f@') {
					if (aydi && aydi.length > 0) {
						;(await Product.findByIdAndDelete({ _id: aydi }, data))
							? res.status(200).json({ success: true })
							: res.status(401).json({ success: false })
					} else {
						res.status(402).json({ success: false })
					}
				} else {
					res.status(405).json({ success: false })
				}
			} else {
				res.status(407).json({ success: false })
			}
		} else {
			res.status(409).json({ success: false })
		}
	} catch (err) {
		res.status(500).json({ success: false, message: `Server Error => ${err}` })
	}
}

export default admin
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '10mb',
		},
	},
}
