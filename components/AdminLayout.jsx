'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Tag } from 'antd';
import { 
  LogoutOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  UserOutlined,
  DatabaseOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import useAuthStore from '@/lib/store/authStore';
import axiosClient from '@/lib/api/axiosClient';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuthStore();
  
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await axiosClient.get('/auth/profiles/');
        
        let profileData = null;
        if (Array.isArray(res.data) && res.data.length > 0) {
          profileData = res.data[0];
        } else if (res.data && !Array.isArray(res.data)) {
          profileData = res.data;
        }
        
        if (profileData?.avatar) {
          setAvatarUrl(profileData.avatar);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAvatar(false);
      }
    };

    if (user) {
      fetchAvatar();
    }
  }, [user]);

  const menuItems = [
    {
      key: '1',
      icon: <DatabaseOutlined />,
      label: <Link href="/">Data Items</Link>,
    },
  ];

  const userDropdownItems = [
    {
      key: 'info',
      label: (
        <div style={{ padding: '4px 0', cursor: 'default' }}>
            <div style={{ fontWeight: 'bold', color: 'black' }}>{user?.username}</div>
            <Tag color={user?.is_staff || user?.role === 'admin' ? 'gold' : 'blue'} style={{ marginTop: 4, marginRight: 0 }}>
                {user?.is_staff || user?.role === 'admin' ? 'ADMIN' : 'USER'}
            </Tag>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <IdcardOutlined />,
      label: <Link href="/profile">Profil Saya</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={240}
        style={{ 
          borderRight: '1px solid #333',
          position: 'fixed', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          zIndex: 100
        }}
      >
        <div style={{ 
            height: 64, 
            margin: 16,
            background: 'rgba(255, 255, 255, 0.1)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 6,
            overflow: 'hidden'
        }}>
          {collapsed ? (
            <div style={{ 
                width: 32, 
                height: 32, 
                background: 'white', 
                color: 'black', 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 4 
            }}>
                M
            </div>
          ) : (
            <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '1px' }}>
              MY<span style={{ fontWeight: 300, color: '#888' }}>APP</span>
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ background: 'transparent', padding: '16px 0' }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s', background: '#000' }}>
        
        <Header style={{ 
          padding: '0 24px', 
          background: 'rgba(17, 17, 17, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #333',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky', 
          top: 0, 
          zIndex: 90
        }}>
          <div onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer', color: 'white', fontSize: 18 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Dropdown menu={{ items: userDropdownItems }} trigger={['click']}>
            <Space style={{ 
                cursor: 'pointer', 
                padding: '8px 12px', 
                borderRadius: 20, 
                transition: 'background 0.3s' 
            }} className="hover:bg-[#222]">
              
              {loadingAvatar ? (
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#555' }}
                />
              ) : avatarUrl ? (
                <Avatar 
                  size="small" 
                  src={avatarUrl}
                  style={{ border: '1px solid #555' }}
                />
              ) : (
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#333' }}
                />
              )}
              
              <span style={{ color: 'white', fontSize: 14, fontWeight: 500, display: 'block' }}>
                {user?.username || 'User'}
              </span>
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