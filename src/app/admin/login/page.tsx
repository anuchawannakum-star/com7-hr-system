'use client';

import { useState } from 'react';
import { styles } from '../../styles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...styles.page,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '24px' }}>
        <div style={{ ...styles.card, padding: '40px 32px', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ ...styles.logo, fontSize: '28px' }}>COM7 HR</span>
            <p style={{ fontSize: '12px', color: '#868e96', marginTop: '4px' }}>Admin Panel</p>
          </div>

          {/* Form */}
          <div style={{ textAlign: 'left' }}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>อีเมล</label>
              <input
                type="email"
                style={styles.input}
                placeholder="admin@com7.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>รหัสผ่าน</label>
              <input
                type="password"
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <p style={{ fontSize: '12px', color: '#e03131', marginBottom: '12px' }}>{error}</p>
            )}

            <button
              style={{ ...styles.btnPrimary, width: '100%', padding: '12px', marginTop: '8px' }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link href="/" style={{ fontSize: '12px', color: '#868e96' }}>
              ← กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
