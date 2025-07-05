const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export async function getAllNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  const json = await response.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json; 
}

export async function getArchivedNotes() {
  const response = await fetch(`${BASE_URL}/notes/archived`);
  const json = await response.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json;
}

export async function createNote(note) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });

  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(`Gagal menyimpan catatan: ${json.message}`);
  }

  return json; 
}

export async function archiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    if (json.status !== 'success') {
      throw new Error(json.message || 'Gagal mengarsipkan catatan');
    }

    return json.data;
  } catch (error) {
    console.error('Archive error:', error);
    throw error;
  }
}

export async function unarchiveNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    if (json.status !== 'success') {
      throw new Error(json.message || 'Gagal mengembalikan catatan');
    }

    return json.data;
  } catch (error) {
    console.error('Unarchive error:', error);
    throw error;
  }
}

export async function deleteNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    if (json.status !== 'success') {
      throw new Error(json.message || 'Gagal menghapus catatan');
    }

    return json.data;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export async function updateNote(id, note) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal mengupdate catatan');
  }
  return json;
}