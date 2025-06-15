import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://api.worqhat.com/api/db/worqClient';

export async function worqClient(sql: string) {
  try {
    const res = await axios.post(
      API_URL,
      { query: sql },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WORQDB_CLIENT_KEY}` || 'wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56',
        },
      }
    );
    return res.data;
  } catch (err: any) {
    throw new Error(`Query failed: ${err.message}`);
  }
}
