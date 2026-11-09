import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DR_URI as string);
const db = client.db("hireloop");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["seeker","recruiter","admin"],
        input: true,
        defaultValue: "job-seeker"
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
