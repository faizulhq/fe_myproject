export const darkTheme = {
  token: {
    // Colors
    colorPrimary: '#8b5cf6',       // Purple primary
    colorBgContainer: '#1a1a2e',   // Dark container
    colorBgElevated: '#16213e',    // Elevated elements
    colorBgLayout: '#0f0f23',      // Layout background
    colorText: '#e4e4e7',          // Text color
    colorTextSecondary: '#a1a1aa', // Secondary text
    colorBorder: '#27272a',        // Border color
    
    // Border Radius
    borderRadius: 12,
    
    // Font
    fontSize: 14,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Card: {
      colorBgContainer: '#1a1a2e',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    },
    Button: {
      controlHeight: 40,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 44,
      colorBgContainer: '#16213e',
    },
    Upload: {
      colorBgContainer: '#16213e',
    },
    Modal: {
      colorBgElevated: '#1a1a2e',
    },
  },
};