import { ObjectId } from "mongodb";

export type UserPost = {
  _id: ObjectId;
  nombre: string;
  email: string;
};
