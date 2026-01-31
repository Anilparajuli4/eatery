export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
export const API_URL = `${API_BASE_URL}/api`;

export const getMediaUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
