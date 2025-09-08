// Google Analytics event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common events for Oryo
export const analytics = {
  // Authentication events
  login: () => trackEvent('login', 'auth', 'google'),
  logout: () => trackEvent('logout', 'auth'),
  
  // Onboarding events
  providerSelected: (provider: string) => trackEvent('provider_selected', 'onboarding', provider),
  onboardingComplete: (provider: string) => trackEvent('onboarding_complete', 'onboarding', provider),
  
  // Chat events
  messageSent: (provider: string) => trackEvent('message_sent', 'chat', provider),
  personalityChanged: (personality: string) => trackEvent('personality_changed', 'chat', personality),
  fileUploaded: (fileType: string) => trackEvent('file_uploaded', 'chat', fileType),
  
  // Export events
  chatExported: (format: string) => trackEvent('chat_exported', 'export', format),
  
  // Error events
  error: (errorType: string, errorMessage?: string) => trackEvent('error', 'error', errorType),
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}
