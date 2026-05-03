// API endpoint constants

// Auth endpoints
export const API_LOGIN = '/api/auth/login';
export const API_PROFILE = '/api/auth/profile';

// Blog endpoints
export const API_BLOG = '/api/blog';
export const API_BLOG_BY_SLUG = (slug: string) => `/api/blog/${slug}`;

// Videos endpoints
export const API_VIDEOS = '/api/videos';
export const API_VIDEO_BY_ID = (id: string) => `/api/videos/${id}`;
export const API_VIDEOS_BY_STATUS = (status: string) => `/api/videos/status/${status}`;
export const API_VIDEOS_SEARCH = (query: string) => `/api/videos/search?q=${query}`;

// Upload endpoints
export const API_UPLOAD = '/api/upload';

// Admission endpoints
export const API_ADMISSION = '/api/admission';
export const API_ADMISSION_BY_TOKEN = (token: string) => `/api/admission?token=${token}`;
export const API_ADMISSION_SEND_TEST_LINK = '/api/admission/send-test-link';
export const API_ADMISSION_GO_TO_TEST = '/api/admission/go-to-test';

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

// Library endpoints
export const API_LIBRARY = '/api/library';
export const API_LIBRARY_BY_ID = (id: string) => `/api/library/${id}`;

// Note endpoints
export const API_NOTES = '/api/notes';
export const API_NOTE_BY_ID = (id: string) => `/api/notes/${id}`;

// Class endpoints
export const API_CLASSES = '/api/classes';
export const API_CLASS_BY_ID = (id: string) => `/api/classes/${id}`;

// Test endpoints
export const API_TESTS = '/api/tests';
export const API_TEST_BY_ID = (id: string) => `/api/tests/${id}`;
export const API_TEST_SUBMIT = '/api/test/submit';
