import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationsAPI } from '../api/endpoints';

export default function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const addNotif = useCallback((n) => {
    setNotifications(prev => {
      if (prev.find(x => x.id === n.id)) return prev;
      return [n, ...prev];
    });
  }, []);

  // Poll pending on mount
  useEffect(() => {
    if (!user) return;
    notificationsAPI.pending()
      .then(r => setNotifications(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [user]);

  // SocketIO live connection
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('kazi_token');
    if (!token) return;

    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', { token });
      notificationsAPI.heartbeat().catch(() => {});
    });

    socket.on('notification', (data) => {
      addNotif({ ...data, created_at: data.created_at || new Date().toISOString() });
    });

    // Heartbeat every 30s to stay online
    const hb = setInterval(() => {
      notificationsAPI.heartbeat().catch(() => {});
    }, 30_000);

    return () => {
      clearInterval(hb);
      notificationsAPI.offline().catch(() => {});
      socket.disconnect();
    };
  }, [user, addNotif]);

  const dismiss = useCallback(async (id) => {
    await notificationsAPI.markRead(id).catch(() => {});
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(async () => {
    await Promise.all(notifications.map(n => notificationsAPI.markRead(n.id).catch(() => {})));
    setNotifications([]);
  }, [notifications]);

  return { notifications, dismiss, dismissAll };
}
