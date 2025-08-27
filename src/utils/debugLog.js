// import { debugLog } from '@/utils/debugLog';

// const { data } = await api.put(`/category/update/${values._id}`, payload);
// debugLog('[UpdateCategory] response data:', data);

// src/utils/debugLog.js
export function debugLog(...args) {
  if (import.meta.env.MODE !== 'production') {
    console.log(...args);
  }
}
