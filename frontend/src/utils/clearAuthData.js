// src/utils/authUtils.js

export const clearAuthData = () => {
  // Clear cookies
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Clear localStorage
  localStorage.clear();
};
