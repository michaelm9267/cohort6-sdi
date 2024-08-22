export const schema = gql`
  type Shop {
    id: Int!
    name: String!
    phone: String!
    dodaac: String!
    address: String!
    city: String!
    state: String!
    zip: Int!
    orgCode: String!
    shopCode: String!
    owner: String!
    users: [User]!
    Orders: Order
  }

  type Query {
    shops: [Shop!]! @skipAuth
    shop(id: Int!): Shop @skipAuth
  }

  input CreateShopInput {
    name: String!
    phone: String!
    address: String!
    city: String!
    state: String!
    zip: Int!
    orgCode: String!
    shopCode: String!
    owner: String!
  }

  input UpdateShopInput {
    name: String
    phone: String
    address: String
    city: String
    state: String
    zip: Int
    orgCode: String
    shopCode: String
    owner: String
  }

  type Mutation {
    createShop(input: CreateShopInput!): Shop! @requireAuth
    updateShop(id: Int!, input: UpdateShopInput!): Shop! @requireAuth
    deleteShop(id: Int!): Shop! @requireAuth
  }
`
