'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  LinkOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {
  Card,
  Typography,
  Spin,
  message,
  Upload,
  Input,
  Button,
  Popconfirm,
  Avatar,
  Space
} from "antd";
import axiosClient from "@/lib/api/axiosClient";
import useAuthStore from "@/lib/store/authStore";

const { Title, Text } = Typography;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("🔍 Fetching profile...");
        const res = await axiosClient.get("/auth/profiles/");
        
        console.log("📦 API Response:", res.data);
        console.log("📦 Response Type:", typeof res.data);
        console.log("📦 Is Array?", Array.isArray(res.data));
        
        let profileData = null;
        
        // PERBAIKAN: Handle berbagai format response
        if (Array.isArray(res.data)) {
          // Jika response berupa array
          if (res.data.length > 0) {
            profileData = res.data[0];
            console.log("✅ Profile found in array:", profileData);
          } else {
            console.log("⚠️ Empty array, profile not found");
          }
        } else if (res.data && typeof res.data === 'object' && res.data.id) {
          // Jika response langsung object dengan ID
          profileData = res.data;
          console.log("✅ Profile found as object:", profileData);
        } else {
          console.log("❌ Invalid response format");
        }

        if (profileData && profileData.id) {
          setProfile(profileData);
          setWebsite(profileData.website || "");
          setImageUrl(profileData.avatar);
          console.log("✅ Profile loaded successfully, ID:", profileData.id);
        } else {
          console.error("❌ Profile data invalid or missing ID");
          message.error("Profile tidak ditemukan. Coba refresh halaman.");
        }
      } catch (error) {
        console.error("❌ Fetch Profile Error:", error);
        console.error("Response Status:", error.response?.status);
        console.error("Response Data:", error.response?.data);
        
        // Jika 404, mungkin profile belum dibuat
        if (error.response?.status === 404) {
          message.error("Profile belum dibuat. Silakan hubungi admin.");
        } else {
          message.error("Gagal memuat profil. Cek console untuk detail.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("File harus berupa gambar!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ukuran gambar harus kurang dari 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async ({ file }) => {
    // VALIDASI: Cek apakah profile.id ada
    if (!profile || !profile.id) {
        console.error("❌ Profile ID tidak ditemukan!");
        console.error("Profile object:", profile);
        message.error("Profile ID tidak ditemukan. Refresh halaman dan coba lagi.");
        return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    console.log("🚀 Uploading avatar...");
    console.log("Profile ID:", profile.id);
    console.log("File name:", file.name);
    console.log("File size:", file.size, "bytes");

    try {
      setUploading(true);
      
      // API Call dengan ID yang valid
      const url = `/auth/profiles/${profile.id}/`;
      console.log("📡 Request URL:", url);
      
      const res = await axiosClient.patch(url, formData);

      console.log("✅ Upload Success:", res.data);
      
      message.success("Foto profil berhasil diperbarui!");
      setImageUrl(res.data.avatar);
      
      // Refresh halaman agar avatar di Navbar ikut berubah
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("❌ Upload Error:", error);
      console.error("Response Status:", error.response?.status);
      console.error("Response Data:", error.response?.data);
      
      // TAMPILKAN ERROR DETAIL
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.avatar?.[0] 
        || "Gagal memperbarui foto profil";
      
      message.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.id) return;
    try {
      setUploading(true);
      
      console.log("🗑️ Deleting avatar for profile ID:", profile.id);
      
      await axiosClient.patch(`/auth/profiles/${profile.id}/`, 
        { avatar: null },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setImageUrl(null);
      message.success("Foto profil berhasil dihapus!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("❌ Delete Avatar Error:", error);
      message.error("Gagal menghapus foto profil");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateWebsite = async () => {
    if (!profile?.id) return;
    try {
      console.log("🔗 Updating website for profile ID:", profile.id);
      
      await axiosClient.patch(`/auth/profiles/${profile.id}/`, 
        { website },
        { headers: { 'Content-Type': 'application/json' } }
      );
      message.success("Link sosial berhasil diperbarui!");
    } catch (error) {
      console.error("❌ Update Website Error:", error);
      message.error("Gagal memperbarui link sosial");
    }
  };

  const uploadButton = (
    <div style={{ color: "#fff" }}>
      {uploading ? <Spin size="small" /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spin size="large" tip="Memuat profil...">
            <div className="p-10" /> 
        </Spin>
      </div>
    );
  }

  // JIKA PROFILE MASIH NULL SETELAH LOADING
  if (!profile || !profile.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card variant="borderless" style={{ background: '#111', border: '1px solid #333', padding: 40, textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white' }}>❌ Profile Tidak Ditemukan</Title>
          <Text style={{ color: '#888', display: 'block', marginBottom: 20 }}>
            Profile Anda belum dibuat atau terjadi kesalahan.
          </Text>
          <Space>
            <Button onClick={() => window.location.reload()}>
              Refresh Halaman
            </Button>
            <Button type="primary" onClick={() => router.push('/')}>
              Kembali ke Dashboard
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex justify-center pt-20">
      <Card
        variant="borderless"
        style={{
          width: 400,
          textAlign: "center",
          backgroundColor: "#111",
          color: "white",
          border: "1px solid #333",
        }}
        loading={uploading && !imageUrl}
      >
        <div className="relative inline-block mb-4">
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <Avatar 
                src={imageUrl} 
                size={100} 
                style={{ border: '2px solid #333' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>

          {imageUrl && (
            <Popconfirm
              title="Hapus Foto Profil?"
              description="Foto akan dihapus permanen."
              okText="Ya"
              cancelText="Batal"
              onConfirm={handleDeleteAvatar}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            </Popconfirm>
          )}
        </div>

        <Title level={4} style={{ margin: 0, color: "white" }}>
          {user?.username || "..."}
        </Title>
        <Text style={{ display: "block", marginBottom: 20, color: "#888" }}>
          {user?.is_staff || user?.role === 'admin' ? "ADMINISTRATOR" : "USER"}
        </Text>

        <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<LinkOutlined style={{ color: "#888" }} />}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Link website/sosmed..."
              onPressEnter={handleUpdateWebsite}
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "white" }}
            />
            <Button type="primary" onClick={handleUpdateWebsite} icon={<SaveOutlined />}>
                Simpan
            </Button>
        </Space.Compact>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: "1rem", color: "#1890ff" }}
          >
            {website}
          </a>
        )}

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          style={{ marginTop: "1.5rem", width: '100%' }}
        >
          Kembali ke Dashboard
        </Button>
      </Card>
    </div>
  );
}