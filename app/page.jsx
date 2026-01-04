'use client';

import { useState } from 'react';
import { Button, Row, Col, Input, Typography, Modal, Spin, Empty, Card } from 'antd';
import { PlusOutlined, SearchOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import AdminLayout from '../components/AdminLayout'; // Import Layout Baru
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '@/lib/hooks/useItems'; // Logic Baru
import useAuthStore from '@/lib/store/authStore';

const { Title, Text } = Typography;

export default function Home() {
  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- LOGIKA BARU (REACT QUERY) ---
  const { data: items = [], isLoading: loading } = useItems();
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
      cancelText: 'Batal',
      centered: true,
      onOk: () => deleteMutation.mutate(id),
    });
  };
  // ----------------------------------

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    // BUNGKUS DENGAN ADMIN LAYOUT AGAR TAMPILAN SIDEBAR MUNCUL
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
        
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Title level={2} style={{ margin: '0 0 4px 0', color: 'white' }}>Data Aset</Title>
            <Text style={{ color: '#888' }}>
              Halo, <span className="text-white font-bold">{user?.username}</span>. Kelola daftar aset dan dokumen Anda.
            </Text>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input 
              prefix={<SearchOutlined style={{ color: '#555' }} />} 
              placeholder="Cari aset..." 
              style={{ width: '250px', background: '#111', border: '1px solid #333', color: 'white' }}
              onChange={(e) => setSearchText(e.target.value)}
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

        {/* STATISTIK SEDERHANA */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              variant="borderless"
              style={{ background: '#111', border: '1px solid #333', borderRadius: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <DatabaseOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
                <div>
                  <Text style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Total Item</Text>
                  <Title level={3} style={{ margin: 0, color: 'white' }}>{items.length}</Title>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              variant="borderless"
              style={{ background: '#111', border: '1px solid #333', borderRadius: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
                <div>
                  <Text style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Dokumen</Text>
                  <Title level={3} style={{ margin: 0, color: 'white' }}>{items.filter(i => i.document).length}</Title>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* GRID CONTENT UTAMA */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
          </div>
        ) : filteredItems.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredItems.map((item) => (
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
        ) : (
          <Empty 
            description={<span style={{ color: '#666' }}>Data tidak ditemukan</span>} 
            style={{ padding: '60px 0', border: '1px dashed #333', borderRadius: '12px', background: '#111' }}
          />
        )}

        {/* MODAL FORM */}
        <Modal
          title={null}
          footer={null}
          open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); setEditingItem(null); }}
          destroyOnHidden
          centered
          width={500}
          styles={{ 
            content: { background: '#111', border: '1px solid #333', padding: 0 },
            mask: { backdropFilter: 'blur(5px)' }
          }}
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