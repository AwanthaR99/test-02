import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "next-sanity" 


const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {

    async signIn({ user }) {
      if (!user.email) return false;

      try {
 
        const userExists = await writeClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email }
        );

        if (!userExists) {
          console.log(`📥 USER NOT FOUND. CREATING NEW USER FOR: ${user.email}`);
          await writeClient.create({
            _type: "user",
            name: user.name,
            email: user.email,
            wishlist: [], 
          });
          console.log(`👤 NEW USER CREATED IN SANITY DB SUCCESSFULLY!`);
        } else {
          console.log(`✓ USER ALREADY EXISTS IN SANITY DB: ${user.email}`);
        }
        return true;
      } catch (error) {
        console.error("❌ ERROR CREATING USER IN SANITY DURING SIGNIN:", error);
        return true; 
      }
    },

    async jwt({ token, user }) {
      if (user && user.email) {
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
        const staffEmails = (process.env.STAFF_EMAILS || "").split(",");

        if (adminEmails.includes(user.email)) {
          token.role = "admin";
        } else if (staffEmails.includes(user.email)) {
          token.role = "staff";
        } else {
          token.role = "customer";
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }