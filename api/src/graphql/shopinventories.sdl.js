export const schema = gql`
  type Shopinventory {
    id: Int!
    part: Part
    partId: Int
    quantity: Int
    maxQuantity: Int
    shop: Shop
    shopID: Int!
  }

  type Query {
    shopinventories: [Shopinventory!]! @skipAuth
    shopinventory(id: Int!): Shopinventory @skipAuth
    shopInventoryByShopId(
      shopID: Int!
      page: Int
      rowsPerPage: Int
      query: String
    ): PartsFilters! @skipAuth
    shopInventoryByPartId(partId: Int, shopID: Int!): Shopinventory @skipAuth
  }

  input CreateShopinventoryInput {
    partId: Int
    quantity: Int
    shopID: Int
  }

  input UpdateShopinventoryInput {
    partId: Int
    quantity: Int
    shopID: Int
    maxQuantity: Int
  }

  type PartsFilters {
    paginatedParts: [Shopinventory!]!
    totalCount: Int
  }

  type Mutation {
    createShopinventory(input: CreateShopinventoryInput!): Shopinventory!
      @requireAuth
    updateShopinventory(
      id: Int!
      input: UpdateShopinventoryInput!
    ): Shopinventory! @requireAuth
    deleteShopinventory(id: Int!): Shopinventory! @skipAuth
  }
`
