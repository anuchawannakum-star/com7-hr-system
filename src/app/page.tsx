'use client';

import { styles } from './styles';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.logo}>COM7 HR</span>
        <span style={{ fontSize: '12px', color: '#868e96' }}>ระบบบริหารเอกสาร HR</span>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#343a40', marginBottom: '8px' }}>
            ระบบจัดการเอกสาร HR
          </h1>
          <p style={{ fontSize: '14px', color: '#868e96' }}>
            COM7 Group — Document Workflow Management System
          </p>
        </div>

        {/* 3 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Card 1: Submit */}
          <Link href="/submit" style={{ textDecoration: 'none' }}>
            <div style={{
              ...styles.card,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '12px',
                background: '#e6f7ef', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '16px', fontSize: '24px'
              }}>📄</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#343a40', marginBottom: '8px' }}>
                ส่งเอกสาร
              </h3>
              <p style={{ fontSize: '12px', color: '#868e96', lineHeight: '1.6' }}>
                ส่งเอกสารทางวินัย / ใบตักเตือน<br/>สำหรับหัวหน้างานและ HR
              </p>
            </div>
          </Link>

          {/* Card 2: Tracking */}
          <Link href="/tracking" style={{ textDecoration: 'none' }}>
            <div style={{
              ...styles.card,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '12px',
                background: '#cce5ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '16px', fontSize: '24px'
              }}>🔍</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#343a40', marginBottom: '8px' }}>
                ตรวจสอบสถานะ
              </h3>
              <p style={{ fontSize: '12px', color: '#868e96', lineHeight: '1.6' }}>
                ตรวจสอบสถานะเอกสารที่ส่ง<br/>ด้วยรหัสอ้างอิง (UUID)
              </p>
            </div>
          </Link>

          {/* Card 3: Admin */}
          <Link href="/admin/login" style={{ textDecoration: 'none' }}>
            <div style={{
              ...styles.card,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '12px',
                background: '#f1f3f5', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '16px', fontSize: '24px'
              }}>⚙️</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#343a40', marginBottom: '8px' }}>
                Admin Login
              </h3>
              <p style={{ fontSize: '12px', color: '#868e96', lineHeight: '1.6' }}>
                เข้าสู่ระบบสำหรับผู้ดูแล<br/>จัดการเคสและอนุมัติเอกสาร
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        fontSize: '12px', color: '#adb5bd',
        borderTop: '1px solid #e9ecef', marginTop: '40px'
      }}>
        © 2024 COM7 Group — HR Document Workflow System V4
      </footer>
    </div>
  );
}
