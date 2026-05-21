import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, jobUpdatesAPI } from '../../api/endpoints';

const statusColor = { pending: '#f59e0b', accepted: '#3b82f6', in_progress: '#8b5cf6', completed: '#10b981', cancelled: '#ef4444', disputed: '#ec4899' };

export default function JobMonitoring() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsAPI.get(id), jobUpdatesAPI.getTimeline(id).catch(() => ({ data: [] }))])
      .then(([j, t]) => { setJob(j.data); setTimeline(Array.isArray(t.data) ? t.data : []); })
      .finally(() => setLoading(false));
  }, [id]);

  const money = (v) => v != null ? `KSh ${Number(v).toLocaleString()}` : '—';
  const fmt = (d) => d ? new Date(d).toLocaleString('en-KE') : '—';

  if (loading) return <div style={s.center}>Loading...</div>;
  if (!job) return <div style={s.center}><div style={s.error}>Job not found.</div></div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate('/admin/jobs')}>← All Jobs</button>
      <div style={s.card}>
        <div style={s.cardTop}>
          <h2 style={s.title}>{job.title}</h2>
          <span style={{ ...s.badge, background: (statusColor[job.status] || '#999') + '22', color: statusColor[job.status] || '#999' }}>
            {job.status?.replace('_', ' ')}
          </span>
        </div>
        <div style={s.details}>
          {[
            { label: 'Location', value: job.location },
            { label: 'Budget', value: money(job.budget) },
            { label: 'Proposed Rate', value: money(job.proposed_rate) },
            { label: 'Category', value: job.category },
            { label: 'Created', value: fmt(job.created_at) },
          ].map(({ label, value }) => (
            <div key={label} style={s.row}><span style={s.lbl}>{label}</span><span>{value || '—'}</span></div>
          ))}
        </div>
      </div>

      {timeline.length > 0 && (
        <div style={s.card}>
          <h3 style={s.sectionTitle}>Timeline</h3>
          {timeline.map((t, i) => (
            <div key={i} style={s.timelineItem}>
              <div style={s.dot} />
              <div>
                <div style={s.timelineTitle}>{t.title || t.type}</div>
                <div style={s.timelineTime}>{fmt(t.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '24px', maxWidth: '640px', margin: '0 auto', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  back: { background: 'none', border: 'none', color: '#148477', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '16px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  title: { fontSize: '1.2rem', fontWeight: 700, color: '#111', flex: 1 },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', marginLeft: '12px', whiteSpace: 'nowrap' },
  details: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  lbl: { color: '#888' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '16px' },
  timelineItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', background: '#148477', flexShrink: 0, marginTop: '4px' },
  timelineTitle: { fontWeight: 600, color: '#222', fontSize: '0.9rem' },
  timelineTime: { color: '#888', fontSize: '0.8rem', marginTop: '2px' },
  error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px' },
};
