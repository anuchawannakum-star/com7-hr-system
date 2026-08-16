'use client';

import { useState } from 'react';
import { styles } from '../styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function UploadSignedPage() {
  const [uuid, setUuid] = useState('');
  const [verified, setVerified] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!uuid.trim()) return;
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('cases')
        .select('*')
        .eq('uuid', uuid.trim())
        .single();
      if (err || !data) {
        setError('ไม่พบเคสที่ตรงกับรหัสนี้');
        return;
      }
      setCaseData(data);
      setVerified(true);
    } catch {
      setError('เกิดข้อผิดพลาด');
    }
  };

  const handleUpload = async () => {
    if (!file || !caseData) return;
    setUploading(true);
    try {
      const fileName = `signed_${caseData.uuid}_${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(fileName, file);
      if (uploadErr) throw uploadErr;

      await supabase.from('case_documents').insert({
        case_id: caseData.id,
        file_name: file.name,
        file_path: fileName,
        document_type: 'signed_return',
      });

      setDone(true);
    } catch (e: any) {
      alert('อัพโหลดไม่สำเร็จ: ' + (e?.message || 'Unknown'));
    } finally {
      setUploading(false);
    }
  };

  if (done) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
        </header>
        <div style={{ ...styles.container, maxWidth: '520px', textAlign: 'center', paddingTop: '60px' }}>
          <div style={{ ...styles.card, padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#155724', marginBottom: '8px' }}>
              อัพโหลดสำเร็จ
            </h2>
            <p style={{ fontSize: '13px', color: '#868e96' }}>
              เอกสารลงชื่อถูกส่งเข้าสู่ระบบเรียบร้อยแล้ว
            </p>
            <Link href="/" style={{ marginTop: '24px', display: 'inline-block' }}>
              <button style={styles.btnPrimary}>กลับหน้าหลัก</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
        <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>อัพโหลดเอกสารลงชื่อ</span>
      </header>

      <div style={{ ...styles.container, maxWidth: '520px' }}>
        <div style={{ ...styles.card, padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#343a40' }}>
            อัพโหลดเอกสารที่ลงชื่อแล้ว
          </h2>
          <p style={{ fontSize: '13px', color: '#868e96', marginBottom: '24px' }}>
            กรอกรหัสอ้างอิงเพื่อยืนยันตัวตน แล้วอัพโหลดเอกสาร
          </p>

          {!verified ? (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>รหัสอ้างอิง (UUID)</label>
                <input
                  style={{ ...styles.input, fontFamily: 'monospace' }}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={uuid}
                  onChange={e => setUuid(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                />
              </div>
              {error && (
                <p style={{ fontSize: '12px', color: '#e03131', marginBottom: '12px' }}>{error}</p>
              )}
              <button style={styles.btnPrimary} onClick={handleVerify}>
                ยืนยันรหัส
              </button>
            </>
          ) : (
            <>
              {/* Verified info */}
              <div style={{ ...styles.alert, ...styles.alertSuccess, marginBottom: '20px' }}>
                ✓ ยืนยันเคสสำเร็จ: <strong>{caseData?.employee_name}</strong> — {caseData?.category}
              </div>

              {/* Upload zone */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>เอกสารที่ลงชื่อแล้ว</label>
                <label style={{
                  ...styles.uploadZone,
                  borderColor: file ? '#00A651' : '#dee2e6',
                  background: file ? '#e6f7ef' : '#f8f9fa',
                }}>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {file ? (
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📎</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#343a40' }}>{file.name}</div>
                      <div style={{ fontSize: '11px', color: '#868e96', marginTop: '4px' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px', color: '#adb5bd' }}>📤</div>
                      <div style={{ fontSize: '13px', color: '#868e96' }}>คลิกเพื่อเลือกไฟล์</div>
                      <div style={{ fontSize: '11px', color: '#adb5bd', marginTop: '4px' }}>PDF, JPG, PNG</div>
                    </div>
                  )}
                </label>
              </div>

              <button
                style={{ ...styles.btnPrimary, opacity: !file || uploading ? 0.6 : 1, width: '100%' }}
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดเอกสาร'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
