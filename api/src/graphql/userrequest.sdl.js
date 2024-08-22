export const schema = gql`
  type UserRequest {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    rank: String!
    hashedPassword: String!
    shopID: Int!
  }

  type Query {
    UserRequests: [UserRequest!]! @requireAuth
    UserRequest(id: Int!): UserRequest @requireAuth
  }

  input CreateUserRequestInput {
    email: String!
    firstName: String!
    lastName: String!
    rank: String!
    hashedPassword: String!
    shopID: Int!
  }

  input UpdateUserRequestInput {
    email: String
    firstName: String
    lastName: String
    rank: String
    hashedPassword: String
    shopID: Int
  }

  type Mutation {
    createUserRequest(input: CreateUserRequestInput!): UserRequest! @requireAuth
    updateUserRequest(id: Int!, input: UpdateUserRequestInput!): UserRequest!
      @requireAuth
    deleteUserRequest(id: Int!): UserRequest! @requireAuth
  }
`
