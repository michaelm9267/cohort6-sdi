export const schema = gql`
  type User {
    id: Int!
    email: String!
    firstName: String
    lastName: String
    rank: String
    shop: Shop
    shopID: Int!
    Orders: [Order]!
    Notification: [Notification]!
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: String!
    status: String
    created: DateTime!
  }

  type Query {
    users: [User!]! @skipAuth
    user(id: Int!): User @skipAuth
    shopUsers(shopID: Int!, page: Int): PagedUsers! @skipAuth
    shopUsersAdmin: [User!]! @skipAuth
    shopUsersTransport: [User!]! @skipAuth
  }

  type PagedUsers {
    paginatedUsers: [User!]!
    totalCount: Int
  }

  input CreateUserInput {
    email: String!
    firstName: String!
    lastName: String!
    rank: String!
    shopID: Int!
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: String
  }

  input UpdateUserInput {
    email: String
    firstName: String
    lastName: String
    rank: String
    shopID: Int
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: String
    status: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @skipAuth
  }
`
