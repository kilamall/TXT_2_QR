/**
 * Cloud OCR Service using OCR.space API
 * Free tier: 25,000 requests/month
 * Get API key from: https://ocr.space/ocrapi
 */

const OCR_API_KEY = 'K87899142388957'; // Free public demo key
const OCR_API_URL = 'https://api.ocr.space/parse/image';

// IMPORTANT: The demo key works but is rate-limited
// For production, get your own free key from: https://ocr.space/ocrapi

export const extractTextFromImage = async (
  base64Image: string,
  onProgress?: (message: string) => void
): Promise<string> => {
  try {
    onProgress?.('Uploading image...');

    // Ensure base64 string is properly formatted
    const base64Data = base64Image.startsWith('data:') 
      ? base64Image 
      : `data:image/jpeg;base64,${base64Image}`;

    const formData = new FormData();
    formData.append('base64Image', base64Data);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    onProgress?.('Processing with OCR...');

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage?.[0] || 'OCR processing failed');
    }

    if (!result.ParsedResults || result.ParsedResults.length === 0) {
      throw new Error('No text found in image');
    }

    const extractedText = result.ParsedResults[0].ParsedText;
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text detected in the image');
    }

    onProgress?.('Text extracted successfully!');
    return extractedText.trim();
  } catch (error: any) {
    console.error('Cloud OCR Error:', error);
    throw error;
  }
};

// Convert image URI to base64
export const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error('Failed to convert image to base64');
  }
};

