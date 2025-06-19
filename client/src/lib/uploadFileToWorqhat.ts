async function uploadFileToWorqhat(): Promise<void> {
    const apiKey = 'wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56';
    const url = 'https://api.worqhat.com/flows/file/fb369b79-18ca-4218-b981-b1e3f6c50319';

    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        console.error('No file selected');
        return;
    }

    const file: File = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { url?: string; [key: string]: any } = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

