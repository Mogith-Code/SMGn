// Central API helper for headers and requests authentication

export const getAuthHeaders = () => {
  const token = localStorage.getItem('smartgn_token');
  const role = localStorage.getItem('smartgn_user_role');
  const userId = localStorage.getItem('smartgn_user_id');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'x-user-id': userId || '',
    'x-user-role': role || ''
  };
};

export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };
  
  return fetch(url, {
    ...options,
    headers
  });
};
