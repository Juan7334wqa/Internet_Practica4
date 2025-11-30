import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../collections/usersPosts";
import { signToken } from "../auth";

const nameCollection = "posts";

export const resolvers: IResolvers = {
  Query: {
    posts: async () => {
      const db = getDB();
      return db.collection(nameCollection).find().toArray();
    },

    post: async (_, { id }) => {
      const db = getDB();
      return db.collection(nameCollection).findOne({ _id: new ObjectId(id) });
    },

    me: async (_, __, { user }) => {
      if (!user) return null;
      return {
        _id: user._id.toString(),
        nombre: user.nombre,
        email: user.email,
      };
    },
  },

  Mutation: {
    register: async (_, { nombre, email, password }) => {
      const userId = await createUser(nombre, email, password);
      return signToken(userId);
    },

    login: async (_, { email, password }) => {
      const user = await validateUser(email, password);
      if (!user) throw new Error("Invalid credentials");
      return signToken(user._id.toString());
    },

    addPost: async (_, { titulo, contenido }, { user }) => {
      const db = getDB();
      const result = await db.collection(nameCollection).insertOne({
        titulo,
        contenido,
        autor: new ObjectId(user?._id),
        fecha_de_creacion: new Date(),
      });

      return {
        _id: result.insertedId,
        titulo,
        contenido,
        autor: user,
        fecha_de_creacion: new Date(),
      };
    },

    updatePost: async (_, { id, titulo, contenido }) => {
      const db = getDB();

      await db.collection(nameCollection).updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...(titulo && { titulo }), ...(contenido && { contenido }) } }
      );

      return await db.collection(nameCollection).findOne({ _id: new ObjectId(id) });
    },

    deletePost: async (_, { id }) => {
      const db = getDB();
      const result = await db.collection(nameCollection).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    },
  },

  Post: {
    autor: async (parent) => {
      const db = getDB();
      return await db.collection("usersPosts").findOne({
        _id: new ObjectId(parent.autor),
      });
    },
  },
};
