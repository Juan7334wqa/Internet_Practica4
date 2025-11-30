import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    _id: ID!
    nombre: String!
    email: String!
  }

  type Post {
    _id: ID!
    titulo: String!
    contenido: String!
    autor: User!
    fecha_de_creacion: String!
  }

  type Query {
    me: User
    posts: [Post]!
    post(id: ID!): Post
  }

  type Mutation {
    register(nombre: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    addPost(titulo: String!, contenido: String!): Post!
    updatePost(id: ID!, titulo: String, contenido: String): Post!
    deletePost(id: ID!): Boolean!
  }
`;
