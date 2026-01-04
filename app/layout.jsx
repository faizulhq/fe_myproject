'use client';

import React, { useEffect } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import theme from './theme/themeConfig';
import QueryProvider from '../lib/providers/QueryProvider';
import useAuthStore from '@/lib/store/authStore';
import './globals.css';

function RootLayoutContent({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth saat aplikasi pertama kali load
    console.log('🚀 App mounted - Initializing auth...');
    initializeAuth();
  }, [initializeAuth]);

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AntdRegistry>
            <ConfigProvider theme={theme}>
              <App>
                <RootLayoutContent>
                  {children}
                </RootLayoutContent>
              </App>
            </ConfigProvider>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}