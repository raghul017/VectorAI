import "dotenv/config"; // <-- loads process.env from .env
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default sql;
