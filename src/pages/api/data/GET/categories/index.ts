import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../../../utils'
import Category from '../../../../../models/Data/Category'
const FindCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { authType } = req.body
      if (authType === 'G&E!T*P^R$O#D$U^C@T*S') {
        await db.connectToShop()
        const categories = await Category.find({})
        res.status(200).json({ success: true, categories })
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
export default FindCategory
