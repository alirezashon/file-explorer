import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../../../utils'
import Product from '../../../../../models/Data/Product'
import mongoose from 'mongoose'

const FindProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { authType, page, limit } = req.body
      await db.connectToShop()
      if (authType === 'G&E!T*P^R$O#D$U^C@T*S') {
        const totalProducts = await Product.countDocuments({})

        const skipCount = (page - 1) * limit

        const products = await Product.find({}, 'src title price description')
          .skip(skipCount)
          .limit(limit)

        const conn = mongoose.connection
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
          bucketName: 'images',
        })

        const getImageBase64 = (
          id: mongoose.Types.ObjectId
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            const bufferChunks: Buffer[] = []
            bucket
              .openDownloadStream(id)
              .on('data', (chunk) => bufferChunks.push(chunk))
              .on('error', (error) => reject(error))
              .on('end', () => {
                const buffer = Buffer.concat(bufferChunks)
                resolve(buffer.toString('base64'))
              })
          })
        }

        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            const srcBase64 = await getImageBase64(product.src)
            return {
              ...product.toObject(),
              src: srcBase64,
            }
          })
        )

        if (page === 1) {
          res
            .status(200)
            .json({ success: true, productsWithImages, totalProducts })
        } else {
          res.status(200).json({ success: true, products })
        }
      } else if (authType === '*k)a(L*i^M%a$s@o(t*A(l*') {
        const totalProducts = await Product.countDocuments({})
        res.status(200).json({ success: true, totalProducts })
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
export const config = {
  api: {
    responseLimit: '228mb',
  },
}
export default FindProduct
