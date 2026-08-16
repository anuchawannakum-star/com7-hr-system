'use client';

import { useState, useEffect } from 'react';
import { styles } from '../../styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Letterhead {
  id: number;
  company_name: string;
  logo_url: string;
  header_text: string;
  address: string;
}

export default function LetterheadsPage() {
  const [letterheads, setLetterheads] = useState<Letterhead[]>([
    { id: 1, company_name: 'COM7 Public Company Limited', logo_url: '', header_text: 'บริษัท คอมเซเว่น จำกัด (มหาชน)', address: '599/9 ถ.เกษมราษฎร์ แขวงคลองมหานาค กรุงเทพฯ 10100' },
    { id: 2, company_name: 'BKP Group', logo_url: '', header_text: 'บริษัท บีเคพี กรุ๊ป จำกัด', address: '123 ถ.รัชดาภิเษก กรุงเทพฯ 10400' },
    { id: 3, company_name: 'Studio7', logo_url: '', header_text: 'บริษัท สตูดิโอเซเว่น จำกัด', address: '599/9 ถ.เกษมราษฎร์ แขวงคลองมหานาค กรุงเทพฯ 10100' },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ company_name: '', header_text: '', address: '' });

  const handleAdd = () => {
    if (!newItem.company_name) return;
    setLetterheads(prev => [
      ...prev,
      { id: Date.now(), company_name: newItem.company_name, logo_url: '', header_text: newItem.header_text, address: newItem.address }
    ]);
    setNewItem({ company_name: '', header_text: '', address: '' });
    setShowAdd(false);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.flexGap}>
          <Link href="/admin/dashboard"><span style={styles.logo}>COM7 HR</span></Link>
          <span style={{ fontSize: '12px', color: '#adb5bd', margin: '0 12px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>จัดการหัวจดหมาย</span>
        </div>
        <button style={styles.btnPrimary} onClick={() => setShowAdd(true)}>
          + เพิ่มหัวจดหมายใหม่
        </button>
      </header>

      <div style={{ ...styles.containerWide, maxWidth: '900px' }}>
        {/* Add New Form */}
        {showAdd && (
          <div style={{ ...styles.card, borderLeft: '4px solid #00A651' }}>
            <div style={styles.cardTitle}>เพิ่มหัวจดหมายใหม่</div>
            <div style={styles.grid2}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ชื่อบริษัท (EN)</label>
                <input
                  style={styles.input}
                  placeholder="Company Name"
                  value={newItem.company_name}
                  onChange={e => setNewItem(p => ({ ...p, company_name: e.target.value }))}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ชื่อบริษัท (TH)</label>
                <input
                  style={styles.input}
                  placeholder="ชื่อบริษัทภาษาไทย"
                  value={newItem.header_text}
                  onChange={e => setNewItem(p => ({ ...p, header_text: e.target.value }))}
                />
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ที่อยู่</label>
              <input
                style={styles.input}
                placeholder="ที่อยู่บริษัท"
                value={newItem.address}
                onChange={e => setNewItem(p => ({ ...p, address: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button style={styles.btnPrimary} onClick={handleAdd}>บันทึก</button>
              <button style={styles.btnSecondary} onClick={() => setShowAdd(false)}>ยกเลิก</button>
            </div>
          </div>
        )}

        {/* List */}
        {letterheads.map((lh) => (
          <div key={lh.id} style={styles.card}>
            <div style={styles.flexBetween}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#343a40' }}>{lh.company_name}</h3>
                <p style={{ fontSize: '12px', color: '#868e96', marginTop: '2px' }}>{lh.header_text}</p>
              </div>
              <div style={styles.flexGap}>
                <button
                  style={{ ...styles.btnSecondary, padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => setEditing(editing === lh.id ? null : lh.id)}
                >
                  {editing === lh.id ? 'ปิด' : 'แก้ไข'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div style={{
              marginTop: '16px',
              padding: '20px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              background: '#fff',
            }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #00A651', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#00A651' }}>
                  {lh.company_name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '11px', color: '#495057' }}>{lh.header_text}</div>
                <div style={{ fontSize: '10px', color: '#868e96', marginTop: '2px' }}>{lh.address}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#adb5bd', textAlign: 'center' }}>
                — ตัวอย่างหัวจดหมาย —
              </div>
            </div>

            {/* Edit form */}
            {editing === lh.id && (
              <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '6px' }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>ที่อยู่</label>
                  <input style={styles.input} defaultValue={lh.address} />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>อัพโหลดโลโก้ใหม่</label>
                  <label style={{ ...styles.uploadZone, padding: '12px' }}>
                    <input type="file" style={{ display: 'none' }} accept=".png,.jpg,.svg" />
                    <span style={{ fontSize: '12px', color: '#868e96' }}>คลิกเพื่อเลือกไฟล์โลโก้</span>
                  </label>
                </div>
                <button style={{ ...styles.btnPrimary, fontSize: '12px', padding: '8px 16px' }}>
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
