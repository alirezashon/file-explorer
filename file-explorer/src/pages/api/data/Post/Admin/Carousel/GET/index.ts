/** @format */

import { NextApiRequest, NextApiResponse } from 'next'
import Carousel from '../../../../../../../models/Carousel'
import db from '../../../../../../../utils'

const cateBrand = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === 'POST') {
			const { authType } = req.body
			if (authType === '^c(a)ta*sEa0c(ga&roo*uxs^ezl&i#A!') {
				await db.connectToShop()
				const carousel = await Carousel.find({})
 				res.status(200).json({ carousel })
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

export default cateBrand
