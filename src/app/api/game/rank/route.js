import { sql } from '@vercel/postgres';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS clicker_rankings (
                email VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                image VARCHAR(255),
                score BIGINT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const { rows } = await sql`SELECT email, name, image, score FROM clicker_rankings ORDER BY score DESC, updated_at ASC LIMIT 50`;
        return NextResponse.json({ rankings: rows });
    } catch (e) {
        console.error('API /game/rank GET Error: ', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { score, nickname } = body;

        await sql`
            CREATE TABLE IF NOT EXISTS clicker_rankings (
                email VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                image VARCHAR(255),
                score BIGINT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const finalName = nickname || token.name || '익명';

        await sql`
            INSERT INTO clicker_rankings (email, name, image, score, updated_at)
            VALUES (${token.email}, ${finalName}, ${token.picture}, ${score}, NOW())
            ON CONFLICT (email)
            DO UPDATE SET 
                name = COALESCE(${nickname || null}, clicker_rankings.name),
                image = EXCLUDED.image,
                score = GREATEST(clicker_rankings.score, EXCLUDED.score),
                updated_at = NOW()
        `;

        const { rows } = await sql`SELECT email, name, image, score FROM clicker_rankings ORDER BY score DESC, updated_at ASC LIMIT 50`;
        return NextResponse.json({ success: true, rankings: rows });
    } catch (e) {
        console.error('API /game/rank POST Error: ', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
