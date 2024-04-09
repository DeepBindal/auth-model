import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import * as bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

import User from "@/lib/models/User";
import { connectToDB } from "@/lib/db";

connectToDB();

export const authOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // credentials: {
      //   email: {
      //     label: "Email",
      //     type: "text",
      //     placeholder: "Your Email",
      //   },
      //   password: {
      //     label: "Password",
      //     type: "password",
      //   },
      // },
      async authorize(credentials) {
        connectToDB();
        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) throw new Error("Email or password is not correct");

        // This is Naive Way of Comparing The Passwords
        // const isPassowrdCorrect = credentials?.password === user.password;
        if (!credentials?.password)
          throw new Error("Please Provide Your Password");
        const isPassowrdCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPassowrdCorrect)
          throw new Error("User name or password is not correct");

        if (!user.emailVerified)
          throw new Error("Please verify your email first!");

        const { password, ...userWithoutPass } = user;
        return userWithoutPass._doc;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "credentials") {
        return true;
      }
      if (account?.provider == "github") {
        connectToDB();
        const existingUser = await User.findOne({
          email: user?.email,
        });
        const { id, ...userWithoutId } = user;
        // console.log("USER WITHOUT ID", userWithoutId)
        if (!existingUser) {
          const result = await User.create({
            username: userWithoutId.name,
            email: userWithoutId.email,
            password: null,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      connectToDB();
      if (user) {
        token.user = user;
        const sessionUser = await User.findOne({
          email: user.email,
        });
        token.user.id = sessionUser._id.toString();
      }
      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
