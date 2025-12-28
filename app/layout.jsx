import { ConfigProvider } from 'antd';
import { darkTheme } from './theme/themeConfig';
import './globals.css';

export const metadata = {
  title: 'Django CRUD - Dark Modern',
  description: 'Next.js + Django REST API with Ant Design',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ConfigProvider theme={darkTheme}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}