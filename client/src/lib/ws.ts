export function buildWebSocketUrl(path = '/ws') {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname || 'localhost';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const fallbackPort =
    window.location.hostname === 'localhost'
      ? import.meta.env.VITE_SERVER_PORT ?? '5000'
      : '';

  const port = window.location.port || fallbackPort;
  const host = port ? `${hostname}:${port}` : hostname;

  return `${protocol}//${host}${normalizedPath}`;
}
