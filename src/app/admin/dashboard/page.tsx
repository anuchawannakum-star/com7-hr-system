'use client';

import { useState, useEffect } from 'react';
import { styles, badgeColors, statusLabels } from '../../styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_review: 0, approved: 0, completed: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', company: '' });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const { data } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    const list = data || [];
    setCases(list);
    setStats({
      total: list.length,
      pending: list.filter(c => c.status === 'pending').length,
      in_review: list.filter(c => c.status === 'in_review').length,
      approved: list.filter(c => c.status === 'approved').length,
      completed: list.filter(c => c.status === 'completed').length,
    });
  };

  const handleFilter = () => {
    // Client-side filter for demo
  };

  const filtered = cases.filter(c => {
    if (filters.search && !c.employee_name?.includes(filters.search) && !c.uuid?.includes(filters.search)) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.company && c.company !== filters.company) return false;
    return true;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.flexGap}>
          <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
          <span style={{ fontSize: '12px', color: '#adb5bd', marginLeft: '12px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500, marginLeft: '12px' }}>Admin Dashboard</span>
        </div>
        <div style={styles.flexGap}>
          <Link href="/admin/master-data">
            <button style={{ ...styles.btnSecondary, fontSize: '12px', padding: '6px 12px' }}>Master Data</button>
          </Link>
          <Link href="/admin/draft-letter">
            <button style={{ ...styles.btnSecondary, fontSize: '12px', padding: '6px 12px' }}>ร่างหนังสือ</button>
          </Link>
          <Link href="/admin/letterheads">
            <button style={{ ...styles.btnSecondary, fontSize: '12px', padding: '6px 12px' }}>หัวจดหมาย</button>
          </Link>
        </div>
      </header>

      <div style={styles.containerWide}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'ทั้งหมด', value: stats.total, color: '#343a40', bg: '#f1f3f5' },
            { label: 'รอดำเนินการ', value: stats.pending, color: '#856404', bg: '#fff3cd' },
            { label: 'กำลังตรวจสอบ', value: stats.in_review, color: '#004085', bg: '#cce5ff' },
            { label: 'อนุมัติแล้ว', value: stats.approved, color: '#155724', bg: '#d4edda' },
            { label: 'เสร็จสิ้น', value: stats.completed, color: '#008542', bg: '#e6f7ef' },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.card, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#868e96', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div style={{ ...styles.card, padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <label style={styles.label}>ค้นหา (ชื่อ / UUID)</label>
              <input
                style={styles.input}
                placeholder="ชื่อพนักงาน หรือ รหัสอ้างอิง..."
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>สถานะ</label>
              <select
                style={styles.select}
                value={filters.status}
                onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
              >
                <option value="">ทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="in_review">กำลังตรวจสอบ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>บริษัท</label>
              <input
                style={styles.input}
                placeholder="เช่น COM7"
                value={filters.company}
                onChange={e => setFilters(p => ({ ...p, company: e.target.value }))}
              />
            </div>
            <button style={{ ...styles.btnPrimary, padding: '10px 16px' }} onClick={handleFilter}>
              ค้นหา
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...styles.card, padding: '0', overflow: 'hidden', marginTop: '16px' }}>
          <table style={styles.table}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={styles.th}>UUID</th>
                <th style={styles.th}>พนักงาน</th>
                <th style={styles.th}>ประเภท</th>
                <th style={styles.th}>บริษัท</th>
                <th style={styles.th}>สถานะ</th>
                <th style={styles.th}>วันที่ส่ง</th>
                <th style={styles.th}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '40px', color: '#868e96' }}>
                    {cases.length === 0 ? 'ยังไม่มีเคสในระบบ' : 'ไม่พบข้อมูลที่ตรงกับตัวกรอง'}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} style={{ transition: 'background 0.1s' }}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '11px', color: '#868e96' }}>
                      {c.uuid?.slice(0, 8)}...
                    </td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{c.employee_name}</td>
                    <td style={{ ...styles.td, fontSize: '12px' }}>{c.category}</td>
                    <td style={styles.td}>{c.company}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(badgeColors[c.status] || badgeColors.pending) }}>
                        {statusLabels[c.status] || c.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontSize: '12px', color: '#868e96' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td style={styles.td}>
                      <Link href={`/admin/cases/${c.id}`}>
                        <button style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '11px' }}>
                          ดูรายละเอียด
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
