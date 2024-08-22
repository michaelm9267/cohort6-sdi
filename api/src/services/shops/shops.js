import { db } from 'src/lib/db'

export const shops = () => {
  return db.shop.findMany()
}

export const shop = ({ id }) => {
  return db.shop.findUnique({
    where: { id },
  })
}

export const createShop = ({ input }) => {
  return db.shop.create({
    data: input,
  })
}

export const updateShop = ({ id, input }) => {
  return db.shop.update({
    data: input,
    where: { id },
  })
}

export const deleteShop = ({ id }) => {
  return db.shop.delete({
    where: { id },
  })
}

export const Shop = {
  users: (_obj, { root }) => {
    return db.shop.findUnique({ where: { id: root?.id } }).users()
  },
  Orders: (_obj, { root }) => {
    return db.shop.findUnique({ where: { id: root?.id } }).Orders()
  },
}
