const STORAGE_KEY = 'notes-app-v2-data';

function getAllNotes() {
  const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return notes;
}

function saveAllNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function generateId() {
  return 'notes-' + Math.random().toString(36).substr(2, 9);
}

const NotesLocal = {
  getAll() {
    return getAllNotes();
  },
  getActive() {
    return getAllNotes().filter(n => !n.archived);
  },
  getArchived() {
    return getAllNotes().filter(n => n.archived);
  },
  add(note) {
    const notes = getAllNotes();
    const newNote = {
      id: generateId(),
      title: note.title,
      body: note.body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    notes.unshift(newNote);
    saveAllNotes(notes);
    return newNote;
  },
  update(id, updates) {
    const notes = getAllNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Catatan tidak ditemukan');
    notes[idx] = { ...notes[idx], ...updates };
    saveAllNotes(notes);
    return notes[idx];
  },
  delete(id) {
    let notes = getAllNotes();
    notes = notes.filter(n => n.id !== id);
    saveAllNotes(notes);
  }
};

export default NotesLocal;
