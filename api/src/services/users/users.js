import crypto from 'crypto'

import { db } from 'src/lib/db'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const shopUsers = async ({ shopID, page }) => {
  let paginatedUsers = await db.user.findMany({
    skip: page * 5,
    take: 5,
    where: { shopID },
  })
  let totalCount = await db.user.count({
    where: { shopID },
  })
  return {
    paginatedUsers,
    totalCount,
  }
}

export const shopUsersAdmin = async () => {
  return db.user.findMany({
    where: {
      roles: { contains: 'admin' },
    },
  })
}

export const shopUsersTransport = async () => {
  return db.user.findMany({
    where: {
      roles: { contains: 'transport' },
    },
  })
}

const hashPassword = (text, salt) => {
  const encryptedString = crypto
    .scryptSync(text.normalize('NFC'), salt, 32)
    .toString('hex')
  return encryptedString
}

export const createUser = ({ input }) => {
  const role = input.shopID === 120 || input.shopID === 124 ? 'admin' : 'basic'
  const salt = crypto.randomBytes(32).toString('hex')
  const hashedPassword = hashPassword(input.hashedPassword, salt)
  return db.user.create({
    data: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      rank: input.rank,
      shopID: input.shopID,
      hashedPassword: `${hashedPassword}|16384|8|1`,
      salt: salt,
      roles: role,
    },
  })
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User = {
  shop: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).shop()
  },
  Orders: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Orders()
  },
  Notification: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Notification()
  },
}
