import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Product from '@/models/Data/Product';
import db from '@/utils';

const uploadImage = async (url: string, bucket: mongoose.mongo.GridFSBucket): Promise<mongoose.Types.ObjectId> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const readableStream = Readable.from(Buffer.from(imageBuffer));
    const fileName = url.split('/').pop() || 'image';

    const uploadStream = bucket.openUploadStream(fileName);

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(uploadStream)
        .on('error', (error) => reject(error))
        .on('finish', () => resolve(uploadStream.id as mongoose.Types.ObjectId));
    });
  } catch (error) {
    throw new Error(`Upload image failed: ${error}`);
  }
};

const Shop = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await db.connect2DB();

    const { items } = req.body; // Expecting 'items' to be an array of data objects
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });

    const results = await Promise.all(
      items.map(async (item: any) => {
        try {
          const fileId = await uploadImage(item.src, bucket);
          const product = await Product.create({
            title: item.title,
            src: fileId,
            price: item.price,
            categories: item.categories,
            link: item.link,
            keywords: item.keywords,
          });
          return product;
        } catch (error) {
          console.error(`Failed to process item ${item.title}: ${error}`);
          throw error;
        }
      })
    );

    res.status(200).json({
      success: true,
      message: 'Products inserted successfully',
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server Error => ${error}` });
  }
};

export default Shop;
