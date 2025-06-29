import axios from 'axios';

// Konfigurasi endpoint API utama
export const BASE_URL = 'http://192.168.243.42:8000';

export const LOGIN_ENDPOINT = BASE_URL + '/api/auth/login';
export const SISWA_ANAK_ENDPOINT = BASE_URL + '/api/siswa-anak';
export const UNIT_ENDPOINT = BASE_URL + '/api/unit';

export async function fetchDataUnit(token: string) {
  try {
    const response = await axios.get(UNIT_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data unit');
  }
}

// Fetch unit by siswa
export async function fetchDataUnitBySiswa(token: string, id_siswa: string) {
  try {
    const response = await axios.post(
      BASE_URL + '/api/unit-by-siswa',
      { id_siswa },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data unit by siswa');
  }
}

export async function fetchDataSiswa(token: string) {
  try {
    const response = await axios.get(SISWA_ANAK_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data siswa');
  }
}
