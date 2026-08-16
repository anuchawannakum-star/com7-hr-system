'use client';

import { useState } from 'react';
import { styles } from '../../styles';
import Link from 'next/link';

export default function DraftLetterPage() {
  const [form, setForm] = useState({
    letterNo: 'HR-2024-001',
    date: new Date().toISOString().split('T')[0],
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    company: 'บริษัท คอมเซเว่น จำกัด (มหาชน)',
    warningLevel: 'ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 1',
    incidentDate: '',
    violation: '',
    regulation: '',
    action: '',
    deadline: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const aiSuggestions = [
    'มาทำงานสาย 3 ครั้งในรอบ 1 เดือน ตามระเบียบข้อ 5.2',
    'ขาดงานโดยไม่แจ้งล่วงหน้า 2 วันติดต่อกัน',
    'ไม่ปฏิบัติตามคำสั่งผู้บังคับบัญชาโดยตรง',
    'ใช้ทรัพย์สินบริษัทเพื่อประโยชน์ส่วนตัว',
  ];

  const handleSend = async () => {
    setSending(true);
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ['hr@com7.com', 'manager@com7.com'],
          subject: `หนังสือตักเตือน - ${form.employeeName} (${form.letterNo})`,
          caseUuid: form.letterNo,
          status: 'draft_sent',
        }),
      });
      setSent(true);
    } catch {
      alert('ส่งไม่สำเร็จ');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.flexGap}>
          <Link href="/admin/dashboard"><span style={styles.logo}>COM7 HR</span></Link>
          <span style={{ fontSize: '12px', color: '#adb5bd', margin: '0 12px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>ร่างหนังสือตักเตือน</span>
        </div>
      </header>

      <div style={{ ...styles.containerWide, maxWidth: '1400px' }}>
        {/* AI Suggestions */}
        <div style={{
          ...styles.card,
          borderLeft: '4px solid #7c3aed',
          background: '#faf5ff',
          padding: '16px 20px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#7c3aed', marginBottom: '8px' }}>
            💡 AI แนะนำข้อความความผิด
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {aiSuggestions.map((s, i) => (
              <button
                key={i}
                style={{
                  padding: '6px 12px', background: '#fff', border: '1px solid #e9d5ff',
                  borderRadius: '100px', fontSize: '11px', color: '#6b21a8', cursor: 'pointer',
                }}
                onClick={() => update('violation', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
          {/* Left: Form */}
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>ข้อมูลหนังสือ</div>
              <div style={styles.grid2}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>เลขที่หนังสือ</label>
                  <input style={styles.input} value={form.letterNo} onChange={e => update('letterNo', e.target.value)} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>วันที่</label>
                  <input type="date" style={styles.input} value={form.date} onChange={e => update('date', e.target.value)} />
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ระดับการตักเตือน</label>
                <select style={styles.select} value={form.warningLevel} onChange={e => update('warningLevel', e.target.value)}>
                  <option>ตักเตือนด้วยวาจา</option>
                  <option>ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 1</option>
                  <option>ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 2</option>
                  <option>ตักเตือนเป็นลายลักษณ์อักษร ครั้งสุดท้าย</option>
                </select>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>ข้อมูลพนักงาน</div>
              <div style={styles.grid2}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>ชื่อ-นามสกุล</label>
                  <input style={styles.input} placeholder="ชื่อ-นามสกุล" value={form.employeeName} onChange={e => update('employeeName', e.target.value)} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>รหัสพนักงาน</label>
                  <input style={styles.input} placeholder="EMP-xxxxx" value={form.employeeId} onChange={e => update('employeeId', e.target.value)} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>ตำแหน่ง</label>
                  <input style={styles.input} placeholder="ตำแหน่ง" value={form.position} onChange={e => update('position', e.target.value)} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>แผนก</label>
                  <input style={styles.input} placeholder="แผนก" value={form.department} onChange={e => update('department', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>รายละเอียดความผิด</div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>วันที่เกิดเหตุ</label>
                <input type="date" style={styles.input} value={form.incidentDate} onChange={e => update('incidentDate', e.target.value)} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ความผิดที่กระทำ</label>
                <textarea
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                  placeholder="อธิบายความผิดที่กระทำ..."
                  value={form.violation}
                  onChange={e => update('violation', e.target.value)}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ระเบียบข้อบังคับที่ฝ่าฝืน</label>
                <input style={styles.input} placeholder="เช่น ระเบียบข้อ 5.2" value={form.regulation} onChange={e => update('regulation', e.target.value)} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>มาตรการ / ข้อปฏิบัติ</label>
                <textarea
                  style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
                  placeholder="สิ่งที่พนักงานต้องปฏิบัติ..."
                  value={form.action}
                  onChange={e => update('action', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div>
            <div style={{
              background: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '48px 40px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              minHeight: '700px',
              position: 'sticky',
              top: '80px',
            }}>
              {/* Letterhead */}
              <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #00A651', paddingBottom: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#00A651' }}>COM7</div>
                <div style={{ fontSize: '12px', color: '#495057', marginTop: '4px' }}>{form.company}</div>
              </div>

              {/* Letter content */}
              <div style={{ fontSize: '13px', lineHeight: '2' }}>
                <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                  <p>เลขที่: {form.letterNo}</p>
                  <p>วันที่: {form.date ? new Date(form.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                </div>

                <p style={{ fontWeight: 700, marginBottom: '16px' }}>
                  เรื่อง: หนังสือ{form.warningLevel}
                </p>

                <p style={{ marginBottom: '12px' }}>
                  เรียน: คุณ{form.employeeName || '_______________'} รหัส: {form.employeeId || '___________'}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  ตำแหน่ง: {form.position || '_______________'} แผนก: {form.department || '_______________'}
                </p>

                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <p style={{ textIndent: '2em' }}>
                    ตามที่ท่านได้กระทำความผิดเมื่อวันที่ {form.incidentDate ? new Date(form.incidentDate).toLocaleDateString('th-TH') : '_______________'} ดังนี้:
                  </p>
                  <p style={{ marginTop: '8px', paddingLeft: '2em', fontStyle: form.violation ? 'normal' : 'italic', color: form.violation ? '#343a40' : '#adb5bd' }}>
                    {form.violation || '(ระบุรายละเอียดความผิด)'}
                  </p>
                </div>

                {form.regulation && (
                  <p style={{ marginBottom: '12px' }}>
                    ซึ่งเป็นการฝ่าฝืนระเบียบข้อบังคับ: {form.regulation}
                  </p>
                )}

                {form.action && (
                  <div style={{ marginTop: '16px' }}>
                    <p>บริษัทจึงขอตักเตือนให้ท่านปฏิบัติดังนี้:</p>
                    <p style={{ paddingLeft: '2em', marginTop: '4px' }}>{form.action}</p>
                  </div>
                )}

                {/* Signatures */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '60px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #343a40', marginBottom: '4px', paddingBottom: '32px' }} />
                    <div style={{ fontSize: '12px', color: '#495057' }}>ผู้บังคับบัญชา</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #343a40', marginBottom: '4px', paddingBottom: '32px' }} />
                    <div style={{ fontSize: '12px', color: '#495057' }}>พนักงาน (รับทราบ)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '48px' }}>
          <Link href="/admin/dashboard">
            <button style={styles.btnSecondary}>ยกเลิก</button>
          </Link>
          {sent ? (
            <div style={{ ...styles.alert, ...styles.alertSuccess, margin: 0, display: 'flex', alignItems: 'center' }}>
              ✓ ส่งอีเมลสำเร็จ — PDF ถูกสร้างและส่งไปยัง HR แล้ว
            </div>
          ) : (
            <button
              style={{ ...styles.btnPrimary, padding: '12px 24px' }}
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? 'กำลังส่ง...' : '✓ ยืนยัน & สร้าง PDF + ส่ง Email'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
