import io, { Socket } from 'socket.io-client';

// Prefer explicit WS URL, else derive from API URL by stripping trailing /api
const deriveSocketUrl = () => {
  const ws = (import.meta as any).env?.VITE_WS_URL as string | undefined;
  const api = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (ws && ws.length) return ws;
  if (api && api.length) return api.replace(/\/?api\/?$/, '');
  return 'http://localhost:5000';
};

const SOCKET_URL = deriveSocketUrl();

// Env-aware logger
const isProd = (import.meta as any).env?.PROD === true;
const log = (...args: any[]) => {
  if (!isProd) console.log('[socket]', ...args);
};
const warn = (...args: any[]) => {
  if (!isProd) console.warn('[socket]', ...args);
};
const errorLog = (...args: any[]) => {
  if (!isProd) console.error('[socket]', ...args);
};

let socket: Socket | null = null;
let statusListeners: Array<(s: { status: 'connecting'|'connected'|'disconnected'|'error'|'reconnecting', retries?: number, error?: string }) => void> = [];
let retryCount = 0;

export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 15000,
    reconnectionAttempts: 8,
    // Start with polling to avoid a noisy initial websocket failure log,
    // then upgrade to websocket when possible.
    transports: ['polling', 'websocket'],
    withCredentials: true
  });

  socket.on('connect', () => {
    retryCount = 0;
    log('connected', socket?.id);
    statusListeners.forEach(fn => fn({ status: 'connected' }));
  });

  socket.on('disconnect', () => {
    warn('disconnected');
    statusListeners.forEach(fn => fn({ status: 'disconnected' }));
  });

  socket.on('connect_error', (error) => {
    errorLog('connect_error', error?.message || String(error));
    statusListeners.forEach(fn => fn({ status: 'error', error: error?.message || String(error) }));
  });

  socket.on('reconnect_attempt', (attempt) => {
    retryCount = attempt;
    warn('reconnect_attempt', attempt);
    statusListeners.forEach(fn => fn({ status: 'reconnecting', retries: attempt }));
  });

  socket.on('reconnect', (attempt) => {
    log('reconnected after', attempt);
    retryCount = 0;
    statusListeners.forEach(fn => fn({ status: 'connected' }));
  });

  socket.on('reconnect_error', (err) => {
    errorLog('reconnect_error', err?.message || String(err));
    statusListeners.forEach(fn => fn({ status: 'error', error: err?.message || String(err), retries: retryCount }));
  });

  socket.on('reconnect_failed', () => {
    errorLog('reconnect_failed');
    statusListeners.forEach(fn => fn({ status: 'error', error: 'reconnect_failed', retries: retryCount }));
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Connection helpers
export const waitForConnection = (timeoutMs = 5000) => {
  const sock = getSocket();
  if (sock?.connected) return Promise.resolve(true);
  return new Promise<boolean>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('socket_connect_timeout'));
    }, timeoutMs);
    sock?.once('connect', () => {
      clearTimeout(timeout);
      resolve(true);
    });
    sock?.once('connect_error', () => {
      clearTimeout(timeout);
      reject(new Error('socket_connect_error'));
    });
  });
};

export const onConnectionStatus = (fn: (s: { status: 'connecting'|'connected'|'disconnected'|'error'|'reconnecting', retries?: number, error?: string }) => void) => {
  statusListeners.push(fn);
};

export const offConnectionStatus = (fn?: (s: { status: 'connecting'|'connected'|'disconnected'|'error'|'reconnecting', retries?: number, error?: string }) => void) => {
  if (!fn) {
    statusListeners = [];
    return;
  }
  statusListeners = statusListeners.filter(l => l !== fn);
};

// User-specific events
export const joinUserRoom = (userId: string) => {
  const sock = getSocket();
  if (sock) {
    sock.emit('join', userId);
  }
};

export const onNotification = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('notification', callback);
  }
};

export const offNotification = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('notification');
  }
};

// Admin events
export const joinAdminRoom = (userId: string) => {
  const sock = getSocket();
  if (sock) {
    sock.emit('joinAdmin', userId);
  }
};

export const onAdminNotification = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('adminNotification', callback);
  }
};

export const offAdminNotification = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('adminNotification');
  }
};

// Task events
export const onTaskUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('taskUpdate', callback);
  }
};

export const offTaskUpdate = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('taskUpdate');
  }
};

// Submission events
export const onSubmissionUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('submissionUpdate', callback);
  }
};

export const offSubmissionUpdate = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('submissionUpdate');
  }
};

// Leaderboard events
export const onLeaderboardUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('leaderboardUpdate', callback);
  }
};

export const offLeaderboardUpdate = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('leaderboardUpdate');
  }
};

// Wallet/Transaction events
export const onWalletUpdate = (callback: (data: any) => void) => {
  const sock = getSocket();
  if (sock) {
    sock.on('walletUpdate', callback);
  }
};

export const offWalletUpdate = () => {
  const sock = getSocket();
  if (sock) {
    sock.off('walletUpdate');
  }
};
