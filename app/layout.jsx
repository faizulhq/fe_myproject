'use client';

import StyledComponentsRegistry from '../lib/AntdRegistry';
import themeConfig from './theme/themeConfig';
import { ConfigProvider } from 'antd';
import AdminLayout from '../components/AdminLayout';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ConfigProvider theme={themeConfig}>
            {/* Bungkus konten dengan AdminLayout */}
            <AdminLayout>
              {children}
            </AdminLayout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}