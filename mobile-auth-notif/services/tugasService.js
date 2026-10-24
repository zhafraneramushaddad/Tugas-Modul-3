import { apiFetch } from './api';

export function getTugas(token) {
  return apiFetch('/tugas', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function addTugas(token, judul, deskripsi) {
  return apiFetch('/tugas', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ judul, deskripsi }),
  });
}