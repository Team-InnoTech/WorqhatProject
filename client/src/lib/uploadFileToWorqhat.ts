import axios from 'axios';

export const uploadFileToWorqhat = async (file: File): Promise<string | null> => {
  const apiKey = 'wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56';
  const url = 'https://api.worqhat.com/flows/file/9cff4cf7-de81-489c-9530-ccb5e6888c9e';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data', // Optional: Axios sets it automatically with FormData
      },
    });

    const data: { url?: string } = response.data;

    if (data.url) {
      console.log("File uploaded URL:", data.url);
      return data.url;
    } else {
      console.error("No URL returned from upload.");
      return null;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error.response?.data || error.message);
    return null;
  }
}
