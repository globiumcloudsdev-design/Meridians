// API endpoint constants

// Auth endpoints
export const API_LOGIN = '/api/auth/login';
export const API_PROFILE = '/api/auth/profile';

// Blog endpoints
export const API_BLOG = '/api/blog';
export const API_BLOG_BY_SLUG = (slug: string) => `/api/blog/${slug}`;

// Upload endpoints
export const API_UPLOAD = '/api/upload';

// Admission endpoints
export const API_ADMISSION = '/api/admission';

// Contact endpoints
export const API_CONTACT = '/api/contact';

// Subscriber endpoints
export const API_SUBSCRIBERS = '/api/subscribers';

// Email endpoints
export const API_SEND_EMAIL = '/api/send-email';

// Timeline endpoints
export const API_TIMELINE = '/api/timeline';
export const API_TIMELINE_BY_ID = (id: string) => `/api/timeline/${id}`;

// Poster endpoints
export const API_POSTERS = '/api/posters';
export const API_POSTERS_BY_ID = (id: string) => `/api/posters/${id}`;
export const API_POSTERS_ACTIVE = '/api/posters/active';
