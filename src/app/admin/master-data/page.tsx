'use client';

import { useState } from 'react';
import { styles } from '../../styles';
import Link from 'next/link';

const tabs = ['บริษัท', 'สาขา', 'พนักงาน', 'หัวหน้า'];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ success: number; errors: number } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDownloadTemplate = () => {
    const templates: Record<number, string> = {
      0: 'company_id,company_name,tax_id,address\n1,COM7,0107547000010,อาคาร COM7',
      1: 'branch_id,branch_name,company_id,region\n1,สาขาสยาม,1,กรุงเทพ',
      2: 'employee_id,name,position,department,branch_id\nEMP-001,สมชาย ใจดี,พนักงานขาย,Sales,1',
      3: 'supervisor_id,name,position,branch_id,email\nSUP-001,วิชัย เก่งกาจ,ผู้จัดการสาขา,1,wichai@com7.com',
    };
    const blob = new Blob([templates[activeTab] || ''], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${tabs[activeTab]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulate processing
    setTimeout(() => {
      setUploadResult({ success: Math.floor(Math.random() * 50) + 10, errors: Math.floor(Math.random() * 3) });
      setUploading(false);
    }, 1500);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.flexGap}>
          <Link href="/admin/dashboard"><span style={styles.logo}>COM7 HR</span></Link>
          <span style={{ fontSize: '12px', color: '#adb5bd', margin: '0 12px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>Master Data Management</span>
        </div>
      </header>

      <div style={{ ...styles.containerWide, maxWidth: '800px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveTab(idx); setUploadResult(null); }}
              style={{
                padding: '10px 20px',
                border: '1px solid #e9ecef',
                borderRadius: '6px 6px 0 0',
                fontSize: '13px',
                fontWeight: activeTab === idx ? 600 : 400,
                color: activeTab === idx ? '#00A651' : '#868e96',
                background: activeTab === idx ? '#fff' : '#f8f9fa',
                cursor: 'pointer',
                borderBottom: activeTab === idx ? '2px solid #00A651' : '1px solid #e9ecef',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Step 1: Download Template */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>ขั้นตอนที่ 1: ดาวน์โหลด Template</div>
          <p style={{ fontSize: '13px', color: '#868e96', marginBottom: '16px' }}>
            ดาวน์โหลด template CSV สำหรับนำเข้าข้อมูล{tabs[activeTab]} กรอกข้อมูลตามรูปแบบที่กำหนด
          </p>
          <button style={styles.btnSecondary} onClick={handleDownloadTemplate}>
            ⬇️ ดาวน์โหลด Template — {tabs[activeTab]}.csv
          </button>
        </div>

        {/* Step 2: Upload */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>ขั้นตอนที่ 2: อัพโหลดข้อมูล</div>
          <p style={{ fontSize: '13px', color: '#868e96', marginBottom: '16px' }}>
            เลือกไฟล์ CSV ที่กรอกข้อมูลเรียบร้อยแล้ว
          </p>

          <label style={{
            ...styles.uploadZone,
            borderColor: uploading ? '#00A651' : '#dee2e6',
          }}>
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            {uploading ? (
              <div>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏳</div>
                <div style={{ fontSize: '13px', color: '#495057' }}>กำลังประมวลผล...</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '20px', marginBottom: '8px', color: '#adb5bd' }}>📤</div>
                <div style={{ fontSize: '13px', color: '#868e96' }}>คลิกเพื่อเลือกไฟล์ CSV</div>
                <div style={{ fontSize: '11px', color: '#adb5bd', marginTop: '4px' }}>หรือลากไฟล์มาวางที่นี่</div>
              </div>
            )}
          </label>

          {/* Results */}
          {uploadResult && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ ...styles.alert, ...styles.alertSuccess }}>
                ✓ นำเข้าสำเร็จ: <strong>{uploadResult.success}</strong> รายการ
                {uploadResult.errors > 0 && (
                  <span style={{ color: '#856404' }}> | ข้อผิดพลาด: {uploadResult.errors} รายการ</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
