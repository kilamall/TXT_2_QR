import Tesseract from 'tesseract.js';

export const recognizeText = async (imageUri: string): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageUri, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return result.data.text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to recognize text from image');
  }
};

export const recognizeTextWithProgress = async (
  imageUri: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageUri, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress);
        }
      },
    });

    return result.data.text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to recognize text from image');
  }
};

