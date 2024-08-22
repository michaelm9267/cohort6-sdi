import { db } from 'src/lib/db'

export const orders = () => {
  return db.order.findMany()
}

export const draftFilter = ({ role, shopID }) => {
  if (role === 'basic') {
    return db.order.findMany({
      where: {
        shopID,
        orderStatus: {
          equals: 'draft',
        },
      },
    })
  }
}

export const statusFilter = async ({
  orderStatus,
  page,
  rowsPerPage,
  role,
  shopID,
  query,
  sort,
}) => {
  const isANumber = parseInt(query)
  const filterConditions =
    role === 'admin'
      ? orderStatus === undefined
        ? { NOT: { orderStatus: { contains: 'draft' } } }
        : { orderStatus }
      : role === 'basic'
      ? orderStatus === undefined
        ? { shopID, NOT: { orderStatus: { contains: 'draft' } } }
        : { shopID, orderStatus }
      : orderStatus === undefined
      ? {
          NOT: {
            OR: [
              { orderStatus: { contains: 'draft' } },
              { orderStatus: { contains: 'pending' } },
              { orderStatus: { contains: 'returned' } },
            ],
          },
        }
      : { orderStatus }
  const searchConditions = {
    AND: [
      role === 'admin'
        ? { NOT: { orderStatus: { contains: 'draft' } } }
        : role === 'basic'
        ? { shopID, NOT: { orderStatus: { contains: 'draft' } } }
        : {
            NOT: {
              orderStatus: {
                OR: [
                  { contains: 'draft' },
                  { contains: 'pending' },
                  { contains: 'returned' },
                ],
              },
            },
          },
      {
        OR: [
          {
            orderNumber: isNaN(isANumber)
              ? undefined
              : {
                  equals: parseInt(query),
                },
          },
          {
            part: {
              OR: [
                { nsn: { contains: query, mode: 'insensitive' } },
                { nomenclature: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
          {
            jcn: { contains: query, mode: 'insensitive' },
          },
          {
            shop: { name: { contains: query, mode: 'insensitive' } },
          },
          {
            user: {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { rank: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
    ],
  }
  let paginatedOrders = await db.order.findMany({
    skip: page * rowsPerPage,
    take: rowsPerPage,
    where:
      query === undefined || query === '' ? filterConditions : searchConditions,
    orderBy: [
      {
        orderNumber: sort,
      },
      {
        orderDate: sort,
      },
    ],
  })
  let totalCount = await db.order.count({
    where:
      query === undefined || query === '' ? filterConditions : searchConditions,
  })
  return {
    paginatedOrders,
    totalCount,
  }
}

export const shopStatusFilter = async ({ shopID, orderStatus }) => {
  let count = await db.order.count({
    where: { shopID, orderStatus },
  })
  return { count }
}

export const shopOrderHomePage = ({ shopID, orderStatus }) => {
  if (orderStatus === undefined) {
    return db.order.findMany({
      take: 5,
      where: {
        AND: [{ shopID }, { NOT: { orderStatus: { contains: 'draft' } } }],
      },
      orderBy: {
        orderDate: 'desc',
      },
    })
  } else {
    return db.order.findMany({
      take: 5,
      where: { shopID, orderStatus },
      orderBy: {
        orderDate: 'desc',
      }
    })
  }
}

export const shopOrders = ({ shopID }) => {
  return db.order.findMany({
    where: { shopID },
  })
}

export const order = ({ id }) => {
  return db.order.findUnique({
    where: { id },
  })
}

export const createOrder = ({ input }) => {
  return db.order.create({
    data: input,
  })
}

export const updateOrder = ({ id, input }) => {
  return db.order.update({
    data: input,
    where: { id },
  })
}

export const deleteOrder = ({ id }) => {
  return db.order.delete({
    where: { id },
  })
}

export const Order = {
  shop: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).shop()
  },
  user: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).user()
  },
  part: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).part()
  },
  notification: (_obj, { root }) => {
    return db.order.findUnique({ where: { id: root?.id } }).notification()
  },
}
