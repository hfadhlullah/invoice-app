/**
 * Get currency word based on currency code
 * @param {string} currency - Currency code
 * @returns {string} - Currency word in Indonesian
 */
function getCurrencyWord(currency) {
  const currencyMap = {
    'Rp': 'Rupiah',
    'IDR': 'Rupiah',
    'USD': 'Dollar Amerika',
    'EUR': 'Euro',
    'GBP': 'Poundsterling',
    'SGD': 'Dollar Singapura',
    'MYR': 'Ringgit Malaysia',
    'AUD': 'Dollar Australia',
    'JPY': 'Yen',
    'CNY': 'Yuan'
  };
  
  return currencyMap[currency] || currency;
}

/**
 * Convert number to words in Indonesian
 * @param {string|number} amount - The amount to convert (can include dots or commas)
 * @param {string} currency - The currency code (Rp, IDR, USD, etc.)
 * @returns {string} - The amount in words
 */
export function numberToWordsID(amount, currency = 'Rp') {
  // Remove any formatting (dots, commas, spaces)
  const cleanAmount = String(amount).replace(/[.,\s]/g, '');
  
  // Parse to number
  const num = parseInt(cleanAmount, 10);
  
  if (isNaN(num) || num < 0) {
    return '';
  }

  // Determine currency word
  const currencyWord = getCurrencyWord(currency);
  
  if (num === 0) {
    return `Nol ${currencyWord}`;
  }

  const ones = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
  const tens = ['', 'Sepuluh', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 
                'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
  const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 
                 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];

  function convertLessThanThousand(n) {
    if (n === 0) return '';
    
    if (n < 10) {
      return ones[n];
    }
    
    if (n >= 10 && n < 20) {
      return teens[n - 10];
    }
    
    if (n >= 20 && n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    
    // n >= 100 and < 1000
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    
    let result = hundred === 1 ? 'Seratus' : ones[hundred] + ' Ratus';
    
    if (remainder > 0) {
      result += ' ' + convertLessThanThousand(remainder);
    }
    
    return result;
  }

  function convert(n) {
    if (n === 0) {
      return '';
    }

    // Billions (Miliar)
    if (n >= 1000000000) {
      const billions = Math.floor(n / 1000000000);
      const remainder = n % 1000000000;
      let result = (billions === 1 ? 'Satu' : convertLessThanThousand(billions)) + ' Miliar';
      if (remainder > 0) {
        result += ' ' + convert(remainder);
      }
      return result;
    }

    // Millions (Juta)
    if (n >= 1000000) {
      const millions = Math.floor(n / 1000000);
      const remainder = n % 1000000;
      let result = convertLessThanThousand(millions) + ' Juta';
      if (remainder > 0) {
        result += ' ' + convert(remainder);
      }
      return result;
    }

    // Thousands (Ribu)
    if (n >= 1000) {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      let result = thousands === 1 ? 'Seribu' : convertLessThanThousand(thousands) + ' Ribu';
      if (remainder > 0) {
        result += ' ' + convert(remainder);
      }
      return result;
    }

    return convertLessThanThousand(n);
  }

  return convert(num) + ' ' + currencyWord;
}

/**
 * Format number with thousands separator
 * @param {string|number} amount - The amount to format
 * @returns {string} - Formatted number with dots as thousands separator
 */
export function formatNumber(amount) {
  // Remove any non-digit characters
  const cleanAmount = String(amount).replace(/\D/g, '');
  
  if (!cleanAmount) return '';
  
  // Add thousands separator (dots for Indonesian format)
  return cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Remove formatting from number string
 * @param {string} formatted - Formatted number string
 * @returns {string} - Clean number string
 */
export function unformatNumber(formatted) {
  return String(formatted).replace(/[.,\s]/g, '');
}
