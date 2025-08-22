import axios from 'axios';

// Konfigurasi endpoint API utama
export const BASE_URL = 'https://siprenpas.my.id';
//export const BASE_URL = 'http://10.43.136.42';

export const LOGIN_ENDPOINT = BASE_URL + '/api/auth/login';
export const REGISTER_ORANGTUA_ENDPOINT = BASE_URL + '/api/auth/register-orangtua';
export const SISWA_ANAK_ENDPOINT = BASE_URL + '/api/siswa-anak';
export const UNIT_ENDPOINT = BASE_URL + '/api/unit';
export const PENGUMUMAN_TERBARU_ENDPOINT = BASE_URL + '/api/pengumuman/terbaru';

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

// Registrasi Orang Tua
export async function registerOrangtua({ name, email, password, password_confirmation, nik }: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nik: string;
}) {
  try {
    const response = await axios.post(REGISTER_ORANGTUA_ENDPOINT, {
      name,
      email,
      password,
      password_confirmation,
      nik,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal registrasi orang tua');
  }
}

// Fetch unit by siswa
export async function fetchDataUnitBySiswa(token: string, id_siswa: string) {
  try {
    const response = await axios.get(
      BASE_URL + '/api/unit-by-siswa',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          id_siswa,
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


export async function fetchSiswaById(token: string, id_siswa: string) {
  try {
    const response = await axios.get(
      BASE_URL + `/api/siswa-by-idsiswa`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          id_siswa,
        },
      }
    );
    return response.data; // sesuai contoh, response berupa array
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail siswa');
  }
}



export async function fetchBiayaByNoPendaftaran(token: string, no_pendaftaran: string) {
  try {
    const response = await axios.get(
      BASE_URL + `/api/getbiayasiswa-by-nopendaftaran`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          no_pendaftaran,
        },
      }
    );
    return response.data; // sesuai contoh, response berupa array
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail siswa');
  }
}



export async function fetchRencanasppByKodeBiaya(token: string, kode_biaya: string) {
  try {
    const response = await axios.get(
      BASE_URL + `/api/getrencanaspp-by-kodebiaya`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          kode_biaya,
        },
      }
    );
    return response.data; // sesuai contoh, response berupa array
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail siswa');
  }
}

export async function fetchHistoribayar(token: string, id_siswa: string) {
  try {
    const response = await axios.get(
      BASE_URL + `/api/gethistoribayar-by-idsiswa`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          id_siswa,
        },
      }
    );
    return response.data; // sesuai contoh, response berupa array
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail siswa');
  }
}


export async function fetchDetailHistoriBayar(token: string, no_bukti: string) {
  try {
    const response = await axios.get(
      BASE_URL + `/api/getdetailhistoribayar`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        params: {
          no_bukti,
        },
      }
    );
    return response.data; // sesuai contoh, response berupa array
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail histori bayar');
  }
}

// Fetch pengumuman terbaru (tanpa authorization)
export async function fetchPengumumanTerbaru() {
  try {
    const response = await axios.get(PENGUMUMAN_TERBARU_ENDPOINT, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data pengumuman terbaru');
  }
}

// Fetch detail pengumuman berdasarkan ID (tanpa authorization)
export async function fetchDetailPengumuman(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/pengumuman/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail pengumuman');
  }
}
