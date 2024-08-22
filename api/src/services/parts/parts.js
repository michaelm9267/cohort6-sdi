import { db } from 'src/lib/db'

export const parts = () => {
  return db.part.findMany()
}

export const searchQuery = ({ term, limit }) => {
  let whereCondition = {};

  if (term) {
    whereCondition = {
      OR: [
        { nomenclature: { contains: term } },
        { nsn: { contains: term } },
        { partNumber: { contains: term } },
        { nmfc: { contains: term } },
      ],
    };
  }

  const queryOptions = {
    where: whereCondition,
    ...(limit && { take: limit }) 
  };

  return db.part.findMany(queryOptions);
};

export const part = ({ id }) => {
  return db.part.findUnique({
    where: { id },
  })
}

export const approvalsFilter = async ({
  status,
  page,
  rowsPerPage,
  query,
  sort,
}) => {
  const filterConditions = () => {
    if (status === 'parts') {
      console.log('empty search for parts')
      return { status: { contains: 'parts' } }
    } else if (status === 'users') {
      console.log('empty search for users')
      return { status: { contains: 'users' } }
    }
  }

  const searchConditions = () => {
    if (status === 'parts') {
      console.log('search word for parts')
      return {
        OR: [
          { nsn: { contains: query, mode: 'insensitive' } },
          { nomenclature: { contains: query, mode: 'insensitive' } },
        ],
      }
    } else if (status === 'users') {
      console.log('search word for users')
      return {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { rank: { contains: query, mode: 'insensitive' } },
        ],
      }
    }
  }

  let paginatedApprovals = []
  let totalCount = 0

  if (status === 'parts') {
    paginatedApprovals = await db.part.findMany({
      skip: page * rowsPerPage,
      take: rowsPerPage,
      where:
        query === undefined || query === ''
          ? filterConditions()
          : searchConditions()
    })
    totalCount = await db.part.count({
      where:
        query === undefined || query === ''
          ? filterConditions()
          : searchConditions(),
    })
  } else if (status === 'users') {
    paginatedApprovals = await db.user.findMany({
      skip: page * rowsPerPage,
      take: rowsPerPage,
      where:
        query === undefined || query === ''
          ? filterConditions()
          : searchConditions(),
      orderBy: [
        {
          created: sort,
        },
      ],
    })
    totalCount = await db.user.count({
      where:
        query === undefined || query === ''
          ? filterConditions()
          : searchConditions(),
    })
  }

  return {
    paginatedApprovals,
    totalCount,
  }
}

export const createPart = ({ input }) => {
  return db.part.create({
    data: input,
  })
}

export const updatePart = ({ id, input }) => {
  return db.part.update({
    data: input,
    where: { id },
  })
}

export const deletePart = ({ id }) => {
  return db.part.delete({
    where: { id },
  })
}

export const Part = {
  Orders: (_obj, { root }) => {
    return db.part.findUnique({ where: { id: root?.id } }).Orders()
  },
}
