'use client';

import { useState } from 'react';
import { styles, badgeColors, statusLabels } from '../styles';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TrackingPage() {
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!uuid.trim()) return;
    setLoading(true);
    setNotFound(false);
    setCaseData(null);

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('uuid', uuid.trim())
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setCaseData(data);
        // Fetch timeline
        const { data: logs } = await supabase
          .from('case_logs')
          .select('*')
          .eq('case_id', data.id)
          .order('created_at', { ascending: true });
        setTimeline(logs || []);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link href="/"><span style={styles.logo}>COM7 HR</span></Link>
        <span style={{ fontSize: '13px', color: '#495057', fontWeight: 500 }}>ตรวจสอบสถานะเอกสาร</span>
      </header>

      <div style={{ ...styles.container, maxWidth: '640px' }}>
        {/* Search Box */}
        <div style={{ ...styles.card, padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#343a40' }}>
            ตรวจสอบสถานะเอกสาร
          </h2>
          <p style={{ fontSize: '13px', color: '#868e96', marginBottom: '24px' }}>
            กรอกรหัสอ้างอิง (UUID) ที่ได้รับตอนส่งเอกสาร
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              style={{ ...styles.input, fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.5px' }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={uuid}
              onChange={e => setUuid(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              style={{ ...styles.btnPrimary, whiteSpace: 'nowrap' }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '...' : 'ค้นหา'}
            </button>
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
            <p style={{ fontSize: '14px', color: '#721c24' }}>ไม่พบเอกสารที่ตรงกับรหัสอ้างอิงนี้</p>
            <p style={{ fontSize: '12px', color: '#868e96', marginTop: '8px' }}>กรุณาตรวจสอบรหัส UUID อีกครั้ง</p>
          </div>
        )}

        {/* Result */}
        {caseData && (
          <>
            {/* Info Card */}
            <div style={styles.card}>
              <div style={styles.flexBetween}>
                <div style={styles.cardTitle}>ข้อมูลเคส</div>
                <span style={{
                  ...styles.badge,
                  ...(badgeColors[caseData.status] || badgeColors.pending),
                }}>
                  {statusLabels[caseData.status] || caseData.status}
                </span>
              </div>
              <div style={styles.grid2}>
                <div>
                  <span style={styles.label}>ประเภท</span>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{caseData.category}</p>
                </div>
                <div>
                  <span style={styles.label}>พนักงาน</span>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{caseData.employee_name}</p>
                </div>
                <div>
                  <span style={styles.label}>บริษัท / สาขา</span>
                  <p style={{ fontSize: '13px' }}>{caseData.company} — {caseData.branch}</p>
                </div>
                <div>
                  <span style={styles.label}>วันที่ส่ง</span>
                  <p style={{ fontSize: '13px' }}>
                    {caseData.created_at ? new Date(caseData.created_at).toLocaleDateString('th-TH') : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>ไทม์ไลน์</div>
              {timeline.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#868e96', fontSize: '13px' }}>
                  <p>📋 เอกสารอยู่ระหว่างรอดำเนินการ</p>
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {/* Vertical line */}
                  <div style={{
                    position: 'absolute', left: '7px', top: '4px', bottom: '4px',
                    width: '2px', background: '#e9ecef'
                  }} />
                  {timeline.map((log, idx) => (
                    <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', left: '-20px', top: '4px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: idx === timeline.length - 1 ? '#00A651' : '#dee2e6',
                        border: '2px solid #fff',
                      }} />
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#343a40' }}>
                        {log.action || log.message}
                      </div>
                      <div style={{ fontSize: '11px', color: '#868e96', marginTop: '2px' }}>
                        {new Date(log.created_at).toLocaleString('th-TH')}
                        {log.actor && ` — ${log.actor}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
