// import { useState } from 'react';
// import { uploadFileToWorqhat } from '../../lib/uploadFileToWorqhat';

// interface NoteUploaderProps {
//   goalId: string;
// }

// export default function NoteUploader({ goalId }: NoteUploaderProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) {
//       alert('📎 Please select a file first.');
//       return;
//     }

//     setUploading(true);

//     try {
//       const fileURL = await uploadFileToWorqhat(file);

//       await fetch('https://api.worqhat.com/database/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer wh_mbtcop3zMtNyR21UOFrhnGWlcH6Ksy6xBOaOb56',
//         },
//         body: JSON.stringify({
//           table: 'goals',
//           documentId: goalId,
//           data: {
//             studyMaterial: fileURL,
//           },
//         }),
//       });

//       alert('✅ File uploaded & goal updated!');
//       setFile(null);
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : 'An unknown error occurred.';
//       console.error(err);
//       alert('🚨 Upload failed: ' + message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div style={{ marginTop: '1rem' }}>
//       <input
//         type="file"
//         disabled={uploading}
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         accept=".pdf,image/*"
//       />
//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         style={{ marginLeft: '0.5rem' }}
//       >
//         {uploading ? '🔄 Uploading...' : 'Upload Study Material'}
//       </button>
//     </div>
//   );
// }