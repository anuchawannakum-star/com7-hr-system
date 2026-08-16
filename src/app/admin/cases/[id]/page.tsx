'use client';

import { useState, useEffect } from 'react';
import { styles, badgeColors, statusLabels } from '../../../styles';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id;
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [sla, setSla] = useState(0);

  useEffect(() => {
    if (caseId) fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    const { data } = await supabase.from('cases').select('*').eq('id', caseId).single();
    if (data) {
      setCaseData(data);
      // Calculate SLA days
      const created = new Date(data.created_at);
      const now = new Date();
      setSla(Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
    }
    // Fetch documents
    const { data: docs } = await supabase.from('case_documents').select('*').eq('case_id', caseId);
    setDocuments(docs || []);
    // Fetch timeline
    const { data: logs } = await supabase
      .from('case_logs')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });
    setTimeline(logs || []);
  };

  const updateStatus = async (newStatus: string) => {
    await supabase.from('cases').update({ status: newStatus }).eq('id', caseId);
    await supabase.from('case_logs').insert({
      case_id: caseId,
      action: `เปลี่ยนสถานะเป็น: ${statusLabels[newStatus] || newStatus}`,
      actor: 'Admin',
    });
    fetchCase();
  };

  if (!caseData) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link href="/admin/dashboard"><span style={styles.logo}>COM7 HR</span></Link>
        </header>
        <div style={{ ...styles.containerWide, textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ color: '#868e96' }}>กำลังโหลดข้อมูลเคส...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.flexGap}>
          <Link href="/admin/dashboard"><span style={styles.logo}>COM7 HR</span></Link>
          <span style={{ fontSize: '12px', color: '#adb5bd', margin: '0 12px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#495057' }}>เคส #{caseId}</span>
        </div>
        <span style={{ ...styles.badge, ...(badgeColors[caseData.status] || badgeColors.pending) }}>
          {statusLabels[caseData.status] || caseData.status}
        </span>
      </header>

      <div style={styles.containerWide}>
        {/* SLA Card */}
        <div style={{
          ...styles.card,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 24px',
          borderLeft: `4px solid ${sla > 7 ? '#e03131' : sla > 3 ? '#ffc107' : '#00A651'}`,
        }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: sla > 7 ? '#e03131' : '#343a40' }}>
              {sla}
            </div>
            <div style={{ fontSize: '11px', color: '#868e96' }}>วันนับจากส่งเรื่อง</div>
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid #e9ecef', paddingLeft: '16px' }}>
            <div style={{ fontSize: '12px', color: '#868e96' }}>SLA Target: 7 วัน</div>
            <div style={{ fontSize: '12px', color: sla > 7 ? '#e03131' : '#155724', fontWeight: 500 }}>
              {sla > 7 ? '⚠️ เกิน SLA แล้ว' : '✓ อยู่ภายใน SLA'}
            </div>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {/* Col 1: Case Info + Employee */}
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>ข้อมูลเคส</div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>ประเภท</span>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{caseData.category}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>บริษัท / สาขา</span>
                <p style={{ fontSize: '13px' }}>{caseData.company} — {caseData.branch}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>วันที่เกิดเหตุ</span>
                <p style={{ fontSize: '13px' }}>{caseData.incident_date || '-'} {caseData.incident_time || ''}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>รายละเอียด</span>
                <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{caseData.description || '-'}</p>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>ข้อมูลพนักงาน</div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>ชื่อ</span>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{caseData.employee_name}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>รหัส</span>
                <p style={{ fontSize: '13px' }}>{caseData.employee_id || '-'}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>ตำแหน่ง</span>
                <p style={{ fontSize: '13px' }}>{caseData.employee_position || '-'}</p>
              </div>
              <div style={styles.fieldGroup}>
                <span style={styles.label}>แผนก</span>
                <p style={{ fontSize: '13px' }}>{caseData.employee_dept || '-'}</p>
              </div>
            </div>
          </div>

          {/* Col 2: Documents */}
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>เอกสารแนบ ({documents.length})</div>
              {documents.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#868e96', textAlign: 'center', padding: '24px' }}>
                  ยังไม่มีเอกสาร
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {documents.map((doc, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px', borderRadius: '6px', background: '#f8f9fa',
                    }}>
                      <span style={{ fontSize: '18px' }}>📄</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#343a40' }}>{doc.file_name}</div>
                        <div style={{ fontSize: '11px', color: '#868e96' }}>{doc.document_type || 'attachment'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload zone */}
              <div style={{ marginTop: '16px' }}>
                <label style={{ ...styles.uploadZone, padding: '16px' }}>
                  <input type="file" style={{ display: 'none' }} />
                  <div style={{ fontSize: '12px', color: '#868e96' }}>+ เพิ่มเอกสาร</div>
                </label>
              </div>
            </div>
          </div>

          {/* Col 3: Timeline */}
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>ไทม์ไลน์</div>
              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Line */}
                <div style={{
                  position: 'absolute', left: '6px', top: '6px', bottom: '6px',
                  width: '2px', background: '#e9ecef'
                }} />

                {/* Created event */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <div style={{
                    position: 'absolute', left: '-17px', top: '4px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#00A651',
                  }} />
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>ส่งเรื่องเข้าระบบ</div>
                  <div style={{ fontSize: '11px', color: '#868e96' }}>
                    {new Date(caseData.created_at).toLocaleString('th-TH')}
                  </div>
                </div>

                {timeline.map((log, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                    <div style={{
                      position: 'absolute', left: '-17px', top: '4px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: idx === timeline.length - 1 ? '#00A651' : '#dee2e6',
                    }} />
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{log.action}</div>
                    <div style={{ fontSize: '11px', color: '#868e96' }}>
                      {new Date(log.created_at).toLocaleString('th-TH')}
                      {log.actor && ` — ${log.actor}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #e9ecef',
        padding: '12px 32px',
        display: 'flex', justifyContent: 'flex-end', gap: '10px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}>
        <button style={styles.btnSecondary} onClick={() => updateStatus('in_review')}>
          📋 รับเรื่อง
        </button>
        <button style={styles.btnSecondary} onClick={() => updateStatus('approved')}>
          ✓ อนุมัติ
        </button>
        <button style={styles.btnDanger} onClick={() => updateStatus('rejected')}>
          ✕ ไม่อนุมัติ
        </button>
        <Link href="/admin/draft-letter">
          <button style={styles.btnPrimary}>📝 ร่างหนังสือตักเตือน</button>
        </Link>
        <button style={{ ...styles.btnPrimary, background: '#008542' }} onClick={() => updateStatus('completed')}>
          ✓ ปิดเคส
        </button>
      </div>
    </div>
  );
}
