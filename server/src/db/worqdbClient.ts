import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const worqClient = async (query: string) => {
  try {
    const response = await axios.post(
      `https://api.worqhat.com/api/db/worqClient`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WORQDB_CLIENT_KEY}` || 'wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('WorqDB query failed:', error.message);
    throw error;
  }
};
