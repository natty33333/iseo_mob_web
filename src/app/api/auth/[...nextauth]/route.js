import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { sql } from '@vercel/postgres'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                try {
                    await sql`
                        INSERT INTO users (email, name, image, last_login)
                        VALUES (${user.email}, ${user.name}, ${user.image}, NOW())
                        ON CONFLICT (email) 
                        DO UPDATE SET 
                            name = EXCLUDED.name,
                            image = EXCLUDED.image,
                            last_login = NOW()
                    `;
                    return true;
                } catch (error) {
                    console.error("Error saving user to DB:", error);
                    return true; // 로그인 흐름을 방해하지 않기 위해 true 반환
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
})

export { handler as GET, handler as POST }
