export const schema = gql`
  type Part {
    id: Int!
    nomenclature: String
    nsn: String
    partNumber: String
    cageCode: String
    unitOfIssue: String!
    unitPrice: String!
    isg: String!
    commodityCode: String!
    shelfLifeCode: String!
    typeCargoCode: String!
    hazardousMaterialCode: String!
    rid: String!
    location: String
    nmfc: String!
    description: String!
    manufacturer: String!
    status: String
    submittingShop: Int
    orders: [Order]!
    Shopinventory: [Shopinventory]!
  }

  union Media = User | Part

  type ApprovalFilter {
    paginatedApprovals: [Media]
    totalCount: Int
  }

  type Query {
    parts: [Part!]! @skipAuth
    part(id: Int!): Part @skipAuth
    searchQuery(term: String, limit: Int): [Part!]! @skipAuth
    approvalsFilter(
      status: String
      page: Int
      rowsPerPage: Int
      query: String
      sort: String
    ): ApprovalFilter @skipAuth
  }

  input CreatePartInput {
    nomenclature: String!
    nsn: String!
    partNumber: String!
    cageCode: String!
    unitOfIssue: String!
    unitPrice: String!
    isg: String!
    commodityCode: String!
    shelfLifeCode: String!
    typeCargoCode: String!
    hazardousMaterialCode: String!
    rid: String!
    nmfc: String!
    description: String!
    manufacturer: String!
    status: String
    submittingShop: Int
  }

  input UpdatePartInput {
    nomenclature: String
    nsn: String
    partNumber: String
    cageCode: String
    unitOfIssue: String
    unitPrice: String
    isg: String
    commodityCode: String
    shelfLifeCode: String
    typeCargoCode: String
    hazardousMaterialCode: String
    rid: String
    location: String
    nmfc: String
    description: String
    manufacturer: String
    status: String
  }

  type Mutation {
    createPart(input: CreatePartInput!): Part! @requireAuth
    updatePart(id: Int!, input: UpdatePartInput!): Part! @requireAuth
    deletePart(id: Int!): Part! @skipAuth
  }
`
