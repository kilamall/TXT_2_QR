/**
 * Auto-detect QR code content type
 */
export const detectQRType = (
  text: string,
): 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'contact' | 'other' => {
  // URL
  if (
    text.match(
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i,
    )
  ) {
    return 'url';
  }

  // Email
  if (text.match(/^mailto:/i) || text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return 'email';
  }

  // Phone
  if (text.match(/^tel:/i) || text.match(/^\+?[\d\s\-\(\)]{10,}$/)) {
    return 'phone';
  }

  // SMS
  if (text.match(/^sms:/i) || text.match(/^smsto:/i)) {
    return 'sms';
  }

  // WiFi
  if (text.match(/^WIFI:/i)) {
    return 'wifi';
  }

  // vCard (Contact)
  if (text.match(/^BEGIN:VCARD/i)) {
    return 'contact';
  }

  // Default to text
  return 'text';
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format text for specific QR types
 */
export const formatQRText = (
  text: string,
  type: 'url' | 'email' | 'phone' | 'sms' | 'text',
): string => {
  switch (type) {
    case 'url':
      return text.startsWith('http') ? text : `https://${text}`;
    case 'email':
      return text.startsWith('mailto:') ? text : `mailto:${text}`;
    case 'phone':
      return text.startsWith('tel:') ? text : `tel:${text}`;
    case 'sms':
      return text.startsWith('sms:') ? text : `sms:${text}`;
    default:
      return text;
  }
};

