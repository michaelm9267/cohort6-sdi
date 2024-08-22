import { db } from 'src/lib/db'

export const UserRequests = () => {
  return db.UserRequest.findMany()
}

export const UserRequest = ({ id }) => {
  return db.UserRequest.findUnique({
    where: { id },
  })
}

export const createUserRequest = ({ input }) => {
  return db.UserRequest.create({
    data: input,
  })
}

export const updateUserRequest = ({ id, input }) => {
  return db.UserRequest.update({
    data: input,
    where: { id },
  })
}

export const deleteUserRequest = ({ id }) => {
  return db.UserRequest.delete({
    where: { id },
  })
}
