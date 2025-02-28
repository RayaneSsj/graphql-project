import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Resolvers} from "../generated/graphql";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const prisma = new PrismaClient();

export const userResolvers: Resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
  },
  Mutation: {
    signUp: (_parent, args) => {
      const { name, email, password } = args;
      
      return prisma.user.findUnique({ where: { email } }).then((existingUser) => {
        if (existingUser) {
          throw new Error("Email already in use");
        }

        return bcrypt.hash(password, 10).then((hashedPassword) => {
          return prisma.user.create({
            data: { name, email, password: hashedPassword },
          }).then((user) => {
            return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
          });
        });
      });
    },

    signIn: (_parent, args) => {
      const { email, password } = args;

      return prisma.user.findUnique({ where: { email } }).then((user) => {
        if (!user) {
          throw new Error("Invalid credentials");
        }

        return bcrypt.compare(password, user.password).then((isValid) => {
          if (!isValid) {
            throw new Error("Invalid credentials");
          }
          return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        });
      });
    },
  },
};
