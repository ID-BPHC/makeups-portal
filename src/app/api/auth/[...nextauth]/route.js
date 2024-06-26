import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const OPTIONS = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
};

const handleAuth = NextAuth(OPTIONS);
export {handleAuth as GET, handleAuth as POST};