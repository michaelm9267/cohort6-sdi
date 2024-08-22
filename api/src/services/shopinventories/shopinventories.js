import { db } from 'src/lib/db'

export const shopinventories = () => {
  return db.shopinventory.findMany()
}

export const shopinventory = ({ id }) => {
  return db.shopinventory.findUnique({
    where: { id },
  })
}

export const shopInventoryByPartId = ({ partId, shopID }) => {
  return db.shopinventory.findFirst({
    where: { partId, shopID },
  })
}

export const shopInventoryByShopId = async ({
  shopID,
  page,
  rowsPerPage,
  query,
}) => {
  const noSearch = { shopID }
  const withSearch = {
    AND: [
      { shopID },
      {
        OR: [
          {
            part: {
              OR: [
                { nsn: { contains: query, mode: 'insensitive' } },
                { nomenclature: { contains: query, mode: 'insensitive' } },
                { partNumber: { contains: query, mode: 'insensitive' } },
                { nsn: { contains: query, mode: 'insensitive' } },
                { unitPrice: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
    ],
  }

  let paginatedParts = await db.shopinventory.findMany({
    skip: page * rowsPerPage,
    take: rowsPerPage,
    where: query === undefined || query === '' ? noSearch : withSearch,
    include: {
      part: true,
    },
  })
  let totalCount = await db.shopinventory.count({
    where: query === undefined || query === '' ? noSearch : withSearch,
  })
  return {
    paginatedParts,
    totalCount,
  }
}

export const createShopinventory = ({ input }) => {
  return db.shopinventory.create({
    data: input,
  })
}

export const updateShopinventory = ({ id, input }) => {
  return db.shopinventory.update({
    data: input,
    where: { id },
  })
}

export const deleteShopinventory = ({ id }) => {
  return db.shopinventory.delete({
    where: { id },
  })
}

export const Shopinventory = {
  shop: (_obj, { root }) => {
    return db.shopinventory.findUnique({ where: { id: root?.id } }).shop()
  },
}
