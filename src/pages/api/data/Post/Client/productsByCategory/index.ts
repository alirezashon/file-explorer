/** @format */

import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../../../../utils'
import Product from '../../../../../../models/Data/Product'

const CateBrand = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === 'POST') {
			const { category, authType } = req.body
			if (authType === ')g(e&t*C^a&t%eG#o$r#I@e%') {
				await db.connectToShop()
				const products = await Product.find({ categories: { $in: [category] } })
				res.status(200).json({ success: true, products })
			} else {
				res.status(407).json({ success: false, message: 'Invalid Auth Type' })
			}
		} else {
			res.status(409).json({ success: false, message: 'Invalid Request Type' })
		}
	} catch (err) {
		res.status(500).json({ success: false, message: `Server Error => ${err}` })
	}
}
export default CateBrand
