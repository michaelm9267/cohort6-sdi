export const schema = gql`
  type Notification {
    id: Int!
    user: User!
    userID: Int!
    order: Order!
    orderID: Int!
    created: DateTime!
    message: String!
    read: Boolean!
  }

  type Query {
    notifications: [Notification!]! @requireAuth
    notification(id: Int!): Notification @requireAuth
  }

  input CreateNotificationInput {
    userID: Int!
    orderID: Int!
    message: String!
  }

  input UpdateNotificationInput {
    userID: Int
    orderID: Int
    created: DateTime
    message: String
    read: Boolean!
  }

  type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!
      @requireAuth
    updateNotification(
      id: Int!
      input: UpdateNotificationInput!
    ): Notification! @requireAuth
    deleteNotification(id: Int!): Notification! @skipAuth
  }

  type Mutation {
    updateNotificationReadStatus(id: ID!): Notification @skipAuth
  }
`
