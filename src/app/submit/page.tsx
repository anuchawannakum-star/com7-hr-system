'use client';

import { useState } from 'react';
import { styles } from '../styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const categories = [
  'ตักเตือนด้วยวาจา',
  'ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 1',
  'ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 2',
  'ตักเตือนเป็นลายลักษณ์อักษร ครั้งสุดท้าย',
  'พักงาน',
  'พ้นสภาพ / เลิกจ้าง',
];

const positions = ['พนักงาน', 'หัวหน้าแผนก', 'ผู้จัดการสาขา', 'ผู้จัดการเขต', 'ผู้อำนวยการ'];

export default function SubmitPage() {
  const [form, setForm] = useState({
    category: '',
    company: '',
    branch: '',
    uploaderName: '',
    uploaderPosition: '',
    supervisorName: '',
    supervisorPosition: '',
    employeeName: '',
    employeeId: '',
    employeePosition: '',
    employeeDept: '',
    incidentDate: '',
    incidentTime: '',
    description: '',
  });
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleFileChange = (idx: number, file: File | null) => {
    setFiles(prev => {
      const next = [...prev];
      next[idx] = file;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.category || !form.employeeName) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('cases').insert({
        category: form.category,
        company: form.company,
        branch: form.branch,
        uploader_name: form.uploaderName,
        uploader_position: form.uploaderPosition,
        supervisor_name: form.supervisorName,
        supervisor_position: form.supervisorPosition,
        employee_name: form.employeeName,
        employee_id: form.employeeId,
        employee_position: form.employeePosition,
        employee_dept: form.employeeDept,
        incident_date: form.incidentDate || null,
        incident_time: form.incidentTime || null,
        description: form.description,
        status: 'pending',
      }).select('uuid').single();

      if (error) throw error;
      setSuccess(data?.uuid || 'SUBMITTED');
    } catch (e: any) {
      alert('เกิดข้อผิดพลาด: ' + (e?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
        </header>
        <div style={{ ...styles.container, textAlign: 'center', paddingTop: '80px' }}>
          <div style={{ ...styles.card, padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#155724' }}>
              ส่งเอกสารสำเร็จ
            </h2>
            <p style={{ fontSize: '13px', color: '#868e96', marginBottom: '24px' }}>
              กรุณาบันทึกรหัสอ้างอิงไว้สำหรับตรวจสอบสถานะ
            </p>
            <div style={{
              background: '#f8f9fa', border: '1px solid #dee2e6',
              borderRadius: '6px', padding: '16px', fontFamily: 'monospace',
              fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px', color: '#343a40'
            }}>
              {success}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link href="/tracking">
                <button style={styles.btnPrimary}>ตรวจสอบสถานะ</button>
              </Link>
              <Link href="/">
                <button style={styles.btnSecondary}>กลับหน้าหลัก</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
        <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>ส่งเอกสารทางวินัย</span>
      </header>

      {/* Form */}
      <div style={styles.container}>
        {/* Section 1: Category */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>1. ประเภทเรื่อง</div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>ประเภทการดำเนินการ *</label>
            <select
              style={styles.select}
              value={form.category}
              onChange={e => update('category', e.target.value)}
            >
              <option value="">-- เลือกประเภท --</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {form.category === 'พ้นสภาพ / เลิกจ้าง' && (
            <div style={{ ...styles.alert, ...styles.alertWarning }}>
              ⚠️ การดำเนินการพ้นสภาพ/เลิกจ้าง ต้องได้รับอนุมัติจากผู้บริหารระดับสูงก่อนดำเนินการ
            </div>
          )}
        </div>

        {/* Section 2: Company/Branch */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>2. บริษัท / สาขา</div>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>บริษัท</label>
              <input
                style={styles.input}
                placeholder="เช่น COM7, BKP"
                value={form.company}
                onChange={e => update('company', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>สาขา</label>
              <input
                style={styles.input}
                placeholder="เช่น สาขาสยาม"
                value={form.branch}
                onChange={e => update('branch', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Uploader/Supervisor */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>3. ผู้อัพโหลด / หัวหน้า</div>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ชื่อผู้อัพโหลด</label>
              <input
                style={styles.input}
                placeholder="ชื่อ-นามสกุล"
                value={form.uploaderName}
                onChange={e => update('uploaderName', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ตำแหน่งผู้อัพโหลด</label>
              <select
                style={styles.select}
                value={form.uploaderPosition}
                onChange={e => update('uploaderPosition', e.target.value)}
              >
                <option value="">-- เลือก --</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ชื่อหัวหน้าที่รับผิดชอบ</label>
              <input
                style={styles.input}
                placeholder="ชื่อ-นามสกุล"
                value={form.supervisorName}
                onChange={e => update('supervisorName', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ตำแหน่งหัวหน้า</label>
              <select
                style={styles.select}
                value={form.supervisorPosition}
                onChange={e => update('supervisorPosition', e.target.value)}
              >
                <option value="">-- เลือก --</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Employee Info */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>4. ข้อมูลพนักงาน</div>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ชื่อ-นามสกุลพนักงาน *</label>
              <input
                style={styles.input}
                placeholder="ชื่อ-นามสกุล"
                value={form.employeeName}
                onChange={e => update('employeeName', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>รหัสพนักงาน</label>
              <input
                style={styles.input}
                placeholder="เช่น EMP-001234"
                value={form.employeeId}
                onChange={e => update('employeeId', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ตำแหน่ง</label>
              <input
                style={styles.input}
                placeholder="ตำแหน่งงาน"
                value={form.employeePosition}
                onChange={e => update('employeePosition', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>แผนก / ฝ่าย</label>
              <input
                style={styles.input}
                placeholder="แผนก"
                value={form.employeeDept}
                onChange={e => update('employeeDept', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Incident Details */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>5. รายละเอียดความผิด / เหตุการณ์</div>
          <div style={styles.grid2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>วันที่เกิดเหตุ</label>
              <input
                type="date"
                style={styles.input}
                value={form.incidentDate}
                onChange={e => update('incidentDate', e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>เวลาที่เกิดเหตุ</label>
              <input
                type="time"
                style={styles.input}
                value={form.incidentTime}
                onChange={e => update('incidentTime', e.target.value)}
              />
            </div>
          </div>
          <div style={{ ...styles.fieldGroup, marginTop: '12px' }}>
            <label style={styles.label}>รายละเอียด</label>
            <textarea
              style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }}
              placeholder="อธิบายรายละเอียดความผิด / เหตุการณ์..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
            />
          </div>
        </div>

        {/* Section 6: File Upload */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>6. เอกสารประกอบ (แนบไฟล์ได้สูงสุด 5 ไฟล์)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[0, 1, 2, 3, 4].map(idx => (
              <label key={idx} style={styles.uploadZone}>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={e => handleFileChange(idx, e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {files[idx] ? (
                  <div>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>📎</div>
                    <div style={{ fontSize: '11px', color: '#343a40', wordBreak: 'break-all' }}>
                      {files[idx]!.name}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '20px', marginBottom: '4px', color: '#adb5bd' }}>+</div>
                    <div style={{ fontSize: '11px', color: '#adb5bd' }}>ไฟล์ที่ {idx + 1}</div>
                  </div>
                )}
              </label>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#868e96', marginTop: '12px' }}>
            รองรับไฟล์: PDF, JPG, PNG, DOC, DOCX (สูงสุด 10MB ต่อไฟล์)
          </p>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Link href="/">
            <button style={styles.btnSecondary}>ยกเลิก</button>
          </Link>
          <button
            style={{ ...styles.btnPrimary, opacity: submitting ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'กำลังส่ง...' : 'ส่งเอกสาร'}
          </button>
        </div>
      </div>
    </div>
  );
}
