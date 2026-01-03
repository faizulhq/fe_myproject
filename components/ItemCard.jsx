import React from 'react';
import { Card, Typography, Tooltip, Tag, Image } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  PictureOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <Card
      hoverable
      variant="outlined" // Pengganti default bordered
      style={{ 
        height: '100%',             
        display: 'flex',            
        flexDirection: 'column',    
        background: '#111111',      
        borderColor: '#333',
        overflow: 'hidden',
        borderRadius: '12px'
      }}
      // PERBAIKAN: bodyStyle deprecated -> styles.body
      styles={{ 
        body: { 
          flex: 1,                    
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }
      }}
      cover={
        <div style={{ height: '200px', width: '100%', background: '#1a1a1a', borderBottom: '1px solid #333', overflow: 'hidden' }}>
          {item.image ? (
            <Image
              alt={item.name}
              src={item.image}
              
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
              
              // PERBAIKAN: wrapperStyle deprecated -> styles.root
              styles={{
                 root: { width: '100%', height: '100%' }
              }}

              // PERBAIKAN: Hapus custom 'mask' di preview untuk menghindari warning deprecated.
              // Ant Design otomatis akan menampilkan ikon mata (preview) yang sudah bagus.
              preview={{
                src: item.image
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
              <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
              <span style={{ fontSize: 12 }}>No Image</span>
            </div>
          )}
        </div>
      }
      actions={[
        <Tooltip title="Edit Data" key="edit">
          <EditOutlined onClick={() => onEdit(item)} className="text-gray-400 hover:text-white" />
        </Tooltip>,
        <Tooltip title="Hapus Data" key="delete">
          <DeleteOutlined onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-400" />
        </Tooltip>
      ]}
    >
      {/* Header: Nama Item */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <Title level={5} style={{ margin: 0, color: 'white', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }} title={item.name}>
            {item.name}
          </Title>
          {item.document && (
            <Tooltip title="Memiliki Dokumen">
              <Tag color="#1f1f1f" style={{ border: '1px solid #333', color: '#888', marginRight: 0, fontSize: '10px', cursor: 'pointer' }}>
                DOC
              </Tag>
            </Tooltip>
          )}
        </div>
        
        {/* Deskripsi */}
        <Text style={{ 
          color: '#888', 
          fontSize: '13px', 
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '40px'
        }}>
          {item.description || "Tidak ada deskripsi."}
        </Text>
      </div>

      {/* Footer: Tanggal */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CalendarOutlined style={{ color: '#555', fontSize: '12px' }} />
        <Text style={{ color: '#555', fontSize: '12px' }}>
          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </div>
    </Card>
  );
}