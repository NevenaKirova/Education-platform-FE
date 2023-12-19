export const getResponseMessage = err => err?.response?.data?.message || err?.data?.message || 'Something went wrong!';
