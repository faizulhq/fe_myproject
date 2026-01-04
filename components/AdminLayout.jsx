'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Spin } from 'antd';
import { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';
import { getProfile } from '@/lib/api/auth';
import Cookies from 'js-cookie';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // AMBIL STATE DARI STORE
  const { user, login, logout, initializeAuth } = useAuthStore();
  
  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    const init = async () => {
      if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
      }

      // Cek Token
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Ambil data user fresh dari backend
      try {
        const res = await getProfile();
        login(res.data); // Update store
        Cookies.set('user', JSON.stringify(res.data), { expires: 1 });
      } catch (error) {
        console.error("Session expired");
        logout();
        Cookies.remove('access_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [pathname, router]); // eslint-disable-line

  const handleLogout = () => {
    logout();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    router.push('/login');
  };

  const menuItems = [
    { key: '1', icon: <DatabaseOutlined />, label: 'Data Items', onClick: () => router.push('/') },
    { key: '2', icon: <UserOutlined />, label: 'Profil Saya', onClick: () => router.push('/profile') },
  ];

  if (publicRoutes.includes(pathname)) return <>{children}</>;
  if (loading) return <Spin size="large" tip="Memuat..." fullscreen />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={240} style={{ borderRight: '1px solid #333', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}>
        <div className="h-16 flex items-center justify-center border-b border-[#333]">
          {collapsed ? (
            <div className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded">M</div>
          ) : (
            <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '1px' }}>MY<span className="font-light text-gray-500">APP</span></Title>
          )}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} style={{ background: 'transparent', padding: '16px 0' }} />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s', background: '#000' }}>
        <Header style={{ padding: '0 24px', background: 'rgba(17, 17, 17, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90 }}>
          <div onClick={() => setCollapsed(!collapsed)} className="cursor-pointer text-white hover:text-gray-400 text-lg">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Dropdown menu={{ items: [{ key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout }] }}>
            <Space className="cursor-pointer hover:bg-[#222] py-1 px-3 rounded-full transition-colors">
              <Avatar src={user?.avatar} icon={<UserOutlined />} className="bg-[#333]" />
              <div className="hidden sm:block leading-tight text-right mr-2">
                 <div className="text-white text-sm font-medium">{user?.username}</div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-wider">{user?.role}</div>
              </div>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}