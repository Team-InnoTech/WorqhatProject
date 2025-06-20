import axios from 'axios';
const apiKey = 'wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56';

export const uploadFileToWorqhat = async (file: File): Promise<string | null> => {
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

    console.log(response);
    const data: { url?: string } = response.data.data;

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


interface FlowInput {
  topic: string;
  status: string;
  resources: string;
  tags: string;
  hours_spent_perday: number;
}

interface FlowResponse {
  estimated_days: number;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
}

export const triggerFlow = async ({
  topic,
  status,
  resources,
  tags,
  hours_spent_perday,
}: FlowInput): Promise<FlowResponse> => {
  const url = 'https://api.worqhat.com/flows/trigger/bf0f7e49-6ecd-440d-bd48-8b776f215cc3';

  const data = {
    topic,
    status,
    resources,
    tags,
    hours_spent_perday,
  };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Success:', response.data);
      return response.data.data as FlowResponse;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};
