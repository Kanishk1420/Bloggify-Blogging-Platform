/**
 * Validates if an email uses an approved domain
 */
export const validateEmailDomain = (email) => {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Please enter a valid email format"
    };
  }
  
  // Get the domain part
  const domain = email.split('@')[1].toLowerCase();
  
  // Whitelist of approved domains
  const approvedDomains = [
    // Major providers
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'live.com',
    'msn.com',
    
    // Education domains
    'edu',
    'ac.in',
    'edu.in',
    
    // Business/professional
    'company.com', // Example, add your specific allowed domains
    
    // Add more domains as needed
  ];
  
  // Check for education domains (which might have various subdomains)
  for (const eduDomain of ['edu', 'ac.in', 'edu.in']) {
    if (domain.endsWith(`.${eduDomain}`)) {
      return {
        valid: true,
        message: "Valid email domain"
      };
    }
  }
  
  // Blacklist of known disposable/temporary email domains
  const blockedDomains = [
    'binafex.com',
    'temp-mail.org',
    'tempmail.com',
    'disposable.com',
    'mailinator.com',
    'guerrillamail.com',
    'sharklasers.com',
    'yopmail.com',
    'trashmail.com',
    'dispostable.com',
    'tempr.email',
    'tempmailo.com',
    // Add more as needed
  ];
  
  // Check if domain is in blacklist
  if (blockedDomains.some(blockedDomain => domain.includes(blockedDomain))) {
    return {
      valid: false,
      message: "Please use a permanent email address. Temporary or disposable email services are not allowed."
    };
  }
  
  // Check if domain is explicitly approved
  if (approvedDomains.includes(domain)) {
    return {
      valid: true,
      message: "Valid email domain"
    };
  }
  
  // For any other domain, perform more validation
  // You may want to adjust this depending on how strict you want to be
  
  // Option 1: Accept all domains not explicitly blocked (less strict)
  // return { valid: true, message: "Valid email domain" };
  
  // Option 2: Only accept whitelisted domains (more strict)
  return {
    valid: false,
    message: "Please use a well-known email provider such as Gmail, Outlook, or Yahoo"
  };
}