// src/utils/error.js
import axios from 'axios';

export function getAxiosErrorMessage(err, fallback = 'Something went wrong') {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.response?.data?.message || err.message || fallback;
  }
  // Non-axios or unexpected error shapes
  return err?.message || fallback;
}
