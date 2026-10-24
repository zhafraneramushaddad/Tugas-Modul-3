const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const responseText = await res.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch (e) {
    throw new Error(`Server mengembalikan HTML (Kemungkinan salah URL/Endpoint): ${responseText.substring(0, 100)}`);
  }

  if (!res.ok) {
    throw new Error(data?.pesan || data?.message || `Request gagal dengan status ${res.status}`);
  }
  return data;
}