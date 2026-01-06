'use client';

import { useState } from 'react';
import { Button, Row, Col, Input, Typography, Modal, Spin, Empty, Card, Tabs, Pagination } from 'antd';
import { PlusOutlined, SearchOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import AdminLayout from '../components/AdminLayout';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/lib/hooks/useItems';
import useAuthStore from '@/lib/store/authStore';

const { Title, Text } = Typography;

export default function Home() {
  const { user } = useAuthStore();
  
  // State untuk Filter & Pagination
  const [activeTab, setActiveTab] = useState('public'); // 'public' atau 'my'
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // FETCH DATA DARI BACKEND
  const { data, isLoading } = useItems({ 
    page, 
    search: searchText, 
    scope: activeTab 
  });

  const items = data?.results || [];
  const totalItems = data?.count || 0;

  const createMutation = useCreateItem(() => { setIsModalOpen(false); setEditingItem(null); });
  const updateMutation = useUpdateItem(() => { setIsModalOpen(false); setEditingItem(null); });
  const deleteMutation = useDeleteItem();

  const handleSubmit = async (formData) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Hapus Item?',
      content: 'Data tidak dapat dikembalikan.',
      okText: 'Hapus',
      okType: 'danger',
      centered: true,
      onOk: () => deleteMutation.mutate(id),
    });
  };

  // Handler Tab Berubah
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1); // Reset ke halaman 1 saat pindah tab
  };

  // Handler Search (user tekan enter atau icon search)
  const onSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Title level={2} style={{ margin: '0 0 4px 0', color: 'white' }}>Data Aset</Title>
            <Text style={{ color: '#888' }}>
              Halo, <span className="text-white font-bold">{user?.username}</span>!
            </Text>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input.Search 
              placeholder="Cari judul..." 
              allowClear
              onSearch={onSearch}
              style={{ width: '250px' }}
              className="custom-search"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              style={{ background: 'white', color: 'black', border: 'none', fontWeight: 600 }}
            >
              Tambah Baru
            </Button>
          </div>
        </div>

        {/* TABS UTAMA */}
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="card"
          className="custom-tabs"
          items={[
            {
              key: 'public',
              label: (
                <span className="px-2">
                  <GlobalOutlined /> Publik
                </span>
              ),
            },
            {
              key: 'my',
              label: (
                <span className="px-2">
                  <UserOutlined /> Milik Saya
                </span>
              ),
            },
          ]}
          style={{ marginBottom: '24px' }}
        />

        {/* CONTENT GRID */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
          </div>
        ) : items.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {items.map((item) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={item.id} style={{ display: 'flex' }}>
                  <div style={{ width: '100%' }}>
                    <ItemCard 
                      item={item} 
                      onEdit={(itm) => { setEditingItem(itm); setIsModalOpen(true); }} 
                      onDelete={handleDelete} 
                    />
                  </div>
                </Col>
              ))}
            </Row>

            {/* PAGINATION */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <Pagination 
                current={page} 
                total={totalItems} 
                pageSize={8}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
                hideOnSinglePage
              />
            </div>
          </>
        ) : (
          <Empty 
            description={<span style={{ color: '#666' }}>Tidak ada data ditemukan</span>} 
            style={{ padding: '60px 0', border: '1px dashed #333', borderRadius: '12px', background: '#111' }}
          />
        )}

        {/* MODAL FORM */}
        <Modal
          title={null} footer={null} open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); setEditingItem(null); }}
          destroyOnHidden centered width={550}
          styles={{ content: { background: '#111', border: '1px solid #333', padding: 0 }, mask: { backdropFilter: 'blur(5px)' } }}
        >
          <ItemForm 
            editingItem={editingItem} 
            onSubmit={handleSubmit} 
            onCancel={() => { setIsModalOpen(false); setEditingItem(null); }} 
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}