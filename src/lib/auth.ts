import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DR_URI as string);
const db = client.db("hireloop");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        input: true,
        defaultValue: "job-seeker",
      },
      // Set by the payment flow (direct Mongo update); declared here so
      // `listUsers` includes it in the admin Users page output.
      premium: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
    },
  },
  plugins: [admin()],
  database: mongodbAdapter(db, {
    client,
  }),
});
