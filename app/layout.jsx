import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import theme from './theme/themeConfig';
import QueryProvider from '../lib/providers/QueryProvider'; // Import Provider
import './globals.css';

export const metadata = {
  title: 'My Project App',
  description: 'Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <App>
                {children}
              </App>
            </ConfigProvider>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}