/** Base URL rỗng = gọi relative `/api/...` (Vite proxy tới backend). Production: set VITE_API_URL. */
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
