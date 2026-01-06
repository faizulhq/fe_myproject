import React from 'react';
import { Card, Typography, Tooltip, Tag, Image, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined, PictureOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import useAuthStore from '@/lib/store/authStore';

const { Title, Text } = Typography;

export default function ItemCard({ item, onEdit, onDelete }) {
  const { user } = useAuthStore();
  
  const canModify = user?.role === 'admin' || item.is_my_item;

  const actions = [];

  if (item.document) {
    actions.push(
      <Tooltip title="Buka Dokumen" key="document">
        <a href={item.document} target="_blank" rel="noopener noreferrer">
          <FileTextOutlined className="text-blue-500 hover:text-blue-400" />
        </a>
      </Tooltip>
    );
  }

  if (canModify) {
    actions.push(
      <Tooltip title="Edit Data" key="edit">
        <EditOutlined onClick={() => onEdit(item)} className="text-gray-400 hover:text-white" />
      </Tooltip>
    );
    actions.push(
      <Tooltip title="Hapus Data" key="delete">
        <DeleteOutlined onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-400" />
      </Tooltip>
    );
  }

  return (
    <Badge.Ribbon 
      text={item.status === 'draft' ? 'Draft' : 'Publik'} 
      color={item.status === 'draft' ? 'gold' : 'cyan'}
    >
      <Card
        hoverable
        variant="outlined"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111111', borderColor: '#333', borderRadius: '12px', overflow: 'hidden' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' } }}
        cover={
          <div style={{ height: '200px', width: '100%', background: '#1a1a1a', borderBottom: '1px solid #333', overflow: 'hidden' }}>
            {item.image ? (
              <Image 
                alt={item.name} 
                src={item.image} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                // ✅ BAGIAN INI SAYA KEMBALIKAN (Mengatur wrapper root image agar full width/height)
                styles={{ root: { width: '100%', height: '100%' } }} 
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <span style={{ fontSize: 12 }}>No Image</span>
              </div>
            )}
          </div>
        }
        actions={actions.length > 0 ? actions : null}
      >
        <div style={{ marginBottom: '12px' }}>
          <Title level={5} style={{ margin: 0, color: 'white' }} ellipsis={{ tooltip: item.name }}>{item.name}</Title>
          
          <div className="flex gap-2 mt-1 mb-2">
             <Tag icon={<UserOutlined />} color="#222" style={{ border: '1px solid #333', color: '#888' }}>
                {item.owner_username || 'Unknown'}
             </Tag>
             
             {item.document && (
               <a href={item.document} target="_blank" rel="noopener noreferrer">
                 <Tag 
                    icon={<FileTextOutlined />} 
                    color="geekblue" 
                    style={{ cursor: 'pointer', border: '1px solid #1d39c4' }}
                 >
                    Lihat Dokumen
                 </Tag>
               </a>
             )}
          </div>

          <Text style={{ color: '#888', fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}>
            {item.description || "Tidak ada deskripsi."}
          </Text>
        </div>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarOutlined style={{ color: '#555', fontSize: '12px' }} />
          <Text style={{ color: '#555', fontSize: '12px' }}>
            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </div>
      </Card>
    </Badge.Ribbon>
  );
}