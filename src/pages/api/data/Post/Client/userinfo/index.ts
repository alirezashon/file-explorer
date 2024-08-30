/** @format */

import { NextApiRequest, NextApiResponse } from "next"
import Client from "../../../../../../models/Client"
import db from "../../../../../../utils"
import ClientSession from "@/models/Client/Session"

const userinfo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const {
        phone,
        name,
        password,
        authType,
        nationalCode,
        houseNumber,
        houseUnit,
        zipCode,
        email,
        address,
      } = req.body
      const token = req.cookies["CTFlEoiSHkeNnToMBLiShoOekn3kN2y@k"]
      if (authType === "C%L&i&E^ne^D%A$UtR") {
        await db.connectToShop()
        const kalim = token && token.split("#")[1].replace(/"$/, "")
        const session = await ClientSession.findOne({
          key: kalim,
        })
        if (session && session.key === kalim) {
          const userSchema = await Client.findOne({ _id: session.client })

          if (userSchema) {
            const updateData = {
              ...(email && { email }),
              ...(name && { name }),
              ...(nationalCode && { nationalCode }),
              ...(password && { password }),
              information: {
                ...userSchema.information,
                ...(address && { address }),
                ...(houseNumber && { houseNumber }),
                ...(houseUnit && { houseUnit }),
                ...(zipCode && { zipCode }),
              },
            }
            if (!address && !houseNumber && !houseUnit && !zipCode) {
              delete updateData.information
            }

            // Update user in the database
            const updatedUser = await Client.findByIdAndUpdate(
              userSchema._id,
              { $set: updateData },
              { new: true }
            )

            res.status(200).json({
              message: "با موفقیت انجام شد",
              success: true,
              updatedUser,
            })
          } else {
            res.status(209).json({
              message: "نام کاربری موجود نمی باشد",
              success: false,
            })
          }
        } else {
          res
            .status(207)
            .json({ success: false, message: "session is expired" })
        }
      } else {
        res.status(407).json({
          message: "Authentication Type not in body of request, check Auth API",
        })
      }
    } else {
      res.status(409).json({ message: "Type of method is not correct" })
    }
  } catch (error) {
    console.error("Error :", error)
    res.status(500).json({ message: "Server Error" })
  }
}

export default userinfo
