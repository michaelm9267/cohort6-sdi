export const schema = gql`
  type Order {
    id: Int!
    orderNumber: Int!
    orderDate: DateTime!
    orderStatus: String!
    shop: Shop!
    shopID: Int
    user: User!
    userID: Int!
    part: Part!
    partId: Int!
    orderQuantity: Int!
    dueInDoc: String
    dueOutDoc: String
    rdd: String
    ujc: String
    dodaac: String
    texCode: String
    jcn: String
    shipTo: String
    sd: String
    projectCode: String
    demandCode: String
    wuc: String
    toRef: String
    markFor: String
    priority: Int
    conFad: String
    message: String
    addedToInventory: Boolean
    notification: [Notification]!
  }

  type ShopStatusCount {
    count: Int!
  }

  type OrderFilters {
    paginatedOrders: [Order!]!
    totalCount: Int
  }

  type Query {
    orders: [Order!]! @skipAuth
    order(id: Int!): Order @skipAuth
    shopOrders(shopID: Int!): [Order!]! @requireAuth
    draftFilter(role: String, shopID: Int): [Order!]! @skipAuth
    statusFilter(
      orderStatus: String
      page: Int
      rowsPerPage: Int
      role: String
      shopID: Int
      query: String
      sort: String
    ): OrderFilters! @skipAuth
    shopStatusFilter(shopID: Int, orderStatus: String): ShopStatusCount!
      @skipAuth
    shopOrderHomePage(shopID: Int!, orderStatus: String): [Order!]! @skipAuth
  }

  input CreateOrderInput {
    shopID: Int!
    userID: Int!
    partId: Int!
    orderQuantity: Int!
    ujc: String
    jcn: String
    shipTo: String
    wuc: String
    toRef: String
    markFor: String
  }

  input UpdateOrderInput {
    orderNumber: Int
    orderDate: DateTime
    orderStatus: String
    shopID: Int
    userID: Int
    partId: Int
    orderQuantity: Int
    dueInDoc: String
    dueOutDoc: String
    rdd: String
    ujc: String
    dodaac: String
    texCode: String
    sd: String
    projectCode: String
    demandCode: String
    priority: Int
    conFad: String
    message: String
    jcn: String
    shipTo: String
    wuc: String
    toRef: String
    markFor: String
    addedToInventory: Boolean
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order! @requireAuth
    updateOrder(id: Int!, input: UpdateOrderInput!): Order! @skipAuth
    deleteOrder(id: Int!): Order! @skipAuth
  }
`
