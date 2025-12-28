'use client';

import { useState, useEffect } from 'react';
import { Layout, Row, Col, Spin, Empty, message, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FiBox, FiPackage } from 'react-icons/fi';
import { api } from '@/lib/api';
import ItemForm from '@/components/ItemForm';
import ItemCard from '@/components/ItemCard';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
    } catch (error) {
      message.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await api.updateItem(editingItem.id, formData);
        message.success('Item berhasil diupdate!');
        setEditingItem(null);
      } else {
        await api.createItem(formData);
        message.success('Item berhasil ditambahkan!');
      }
      fetchItems();
    } catch (error) {
      message.error('Gagal menyimpan item');
      throw error;
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteItem(id);
      message.success('Item berhasil dihapus!');
      fetchItems();
    } catch (error) {
      message.error('Gagal menghapus item');
    }
  };

  return (
    <Layout className="min-h-screen bg-[#0f0f23]">
      {/* Header */}
      <Header className="bg-[#1a1a2e] border-b border-[#27272a] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <Title level={3} className="!mb-0 !text-white">
                myproject
              </Title>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <FiBox />
            <span>{items.length} Items</span>
          </div>
        </div>
      </Header>

      {/* Content */}
      <Content className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Form Section */}
          <ItemForm
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />

          {/* Items Grid */}
          <div className="bg-[#1a1a2e] rounded-2xl p-8 shadow-2xl border border-[#27272a]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <FiBox className="text-purple-400" />
              </div>
              <Title level={2} className="!mb-0 !text-white">
                Daftar Items
              </Title>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Spin 
                  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
                  tip={<span className="text-gray-400 mt-4">Memuat data...</span>}
                />
              </div>
            ) : items.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400">
                    Belum ada item. Tambahkan item pertama!
                  </span>
                }
                className="py-20"
              />
            ) : (
              <Row gutter={[24, 24]}>
                {items.map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item.id}>
                    <ItemCard
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-[#1a1a2e] border-t border-[#27272a] text-center">
        <Text className="text-gray-400">
          Dibuat dengan ❤️ menggunakan{' '}
          <span className="text-purple-400 font-semibold">Next.js</span> +{' '}
          <span className="text-purple-400 font-semibold">Django</span> +{' '}
          <span className="text-purple-400 font-semibold">Ant Design</span>
        </Text>
        <br />
        <Text className="text-gray-500 text-sm">
          Backend API:{' '}
          <a
            href="https://myproject-production-ee63.up.railway.app/api/items/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300"
          >
            Railway
          </a>
        </Text>
      </Footer>
    </Layout>
  );
}