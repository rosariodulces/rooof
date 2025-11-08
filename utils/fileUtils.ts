
export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL: "data:image/png;base64,iVBORw0KGgo..."
        // We need to extract the base64 part.
        const base64String = reader.result.split(',')[1];
        resolve({ data: base64String, mimeType: file.type });
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
