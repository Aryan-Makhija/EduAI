// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';

// const pg = neon(process.env.DATABASE_URL);
// const db = drizzle({ client: pg });


// export default db

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let db;

export function getDb() {
    if (!db) {
        const pg = neon(process.env.DATABASE_URL);
        db = drizzle({ client: pg });
    }

    return db;
}