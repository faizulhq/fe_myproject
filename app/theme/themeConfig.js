import { theme } from 'antd';

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: "'Inter', sans-serif",
    colorBgBase: '#000000',      // Background Hitam Pekat
    colorBgContainer: '#111111', // Container sedikit lebih terang
    colorBgElevated: '#1a1a1a',  // Dropdown/Modal
    colorPrimary: '#ffffff',     // Aksen Putih
    colorText: '#ffffff',
    colorTextSecondary: '#888888',
    colorBorder: '#333333',
    borderRadius: 8,
  },
  components: {
    Layout: {
      bodyBg: '#000000',
      headerBg: '#111111',
      siderBg: '#111111',
    },
    Button: {
      primaryColor: '#000000',
      fontWeight: 600,
    },
    Card: {
      colorBgContainer: '#111111',
      boxShadowTertiary: '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
    }
  }
};

export default themeConfig;