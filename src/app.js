import '../src/components/index.js';
import home from '../src/components/view/home.js';
import NotesLocal from './script/notesLocal.js';

document.addEventListener('DOMContentLoaded', () => {
  home();
  loadNotes();
  setFormListener();
  setEditModalListener();
  setEditNoteEventListener();
  setPageNavigation();
});

function setPageNavigation() {
  const showActiveBtn = document.getElementById('showActiveBtn');
  const showArchivedBtn = document.getElementById('showArchivedBtn');
  const inputSection = document.getElementById('input-section');
  const noteSection = document.getElementById('note');
  const archivedPage = document.getElementById('archivedPage');

  showActiveBtn.onclick = () => {
    showActiveBtn.classList.add('active');
    showArchivedBtn.classList.remove('active');
    inputSection.style.display = '';
    noteSection.style.display = '';
    archivedPage.style.display = 'none';
  };
  showArchivedBtn.onclick = () => {
    showActiveBtn.classList.remove('active');
    showArchivedBtn.classList.add('active');
    inputSection.style.display = 'none';
    noteSection.style.display = 'none';
    archivedPage.style.display = '';
  };
  // Default: aktif
  showActiveBtn.classList.add('active');
  inputSection.style.display = '';
  noteSection.style.display = '';
  archivedPage.style.display = 'none';
}

async function setFormListener() {
  const notesForm = document.getElementById('notesForm');
  const titleInput = notesForm.elements.noteTitle;
  const descInput = notesForm.elements.noteDesc;
  const titleError = document.getElementById('titleError');
  const descError = document.getElementById('descError');

  titleInput.addEventListener('input', () => {
    titleError.textContent = titleInput.validity.valid ? '' : 'Judul harus diisi dan minimal 3 karakter.';
  });

  descInput.addEventListener('input', () => {
    descError.textContent = descInput.validity.valid ? '' : 'Deskripsi harus diisi dan minimal 5 karakter.';
  });

  notesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!notesForm.checkValidity()) return;

    const noteTitle = titleInput.value.trim();
    const noteDesc = descInput.value.trim();

    try {
      NotesLocal.add({ title: noteTitle, body: noteDesc });

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil disimpan.',
        timer: 1200,
        showConfirmButton: false,
      });

      notesForm.reset();
      loadNotes();
      document.dispatchEvent(new CustomEvent('refresh-notes'));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal menyimpan!',
        text: error.message || 'Terjadi kesalahan.',
      });
    }
  });
}

async function loadNotes() {
  try {
    const notes = NotesLocal.getActive();
    const noteListElement = document.querySelector('note-list');
    noteListElement.innerHTML = '';

    notes.forEach(note => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;
      noteListElement.appendChild(noteItemElement);
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal memproses!',
      text: error.message || 'Terjadi kesalahan saat memuat catatan.',
    });
  }
}

function setEditNoteEventListener() {
  document.addEventListener('edit-note', (event) => {
    const note = event.detail.note;
    showEditModal(note);
  });
}

function showEditModal(note) {
  const modal = document.getElementById('editNoteModal');
  const titleInput = document.getElementById('editNoteTitle');
  const descInput = document.getElementById('editNoteDesc');
  const titleError = document.getElementById('editTitleError');
  const descError = document.getElementById('editDescError');

  titleInput.value = note.title;
  descInput.value = note.body;
  titleError.textContent = '';
  descError.textContent = '';
  modal.style.display = 'block';
  modal.dataset.noteId = note.id;
}

function setEditModalListener() {
  const modal = document.getElementById('editNoteModal');
  const closeBtn = document.getElementById('closeEditModal');
  const form = document.getElementById('editNoteForm');
  const titleInput = document.getElementById('editNoteTitle');
  const descInput = document.getElementById('editNoteDesc');
  const titleError = document.getElementById('editTitleError');
  const descError = document.getElementById('editDescError');

  closeBtn.onclick = () => { modal.style.display = 'none'; };

  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
  };

  titleInput.addEventListener('input', () => {
    titleError.textContent = titleInput.validity.valid ? '' : 'Judul harus diisi dan minimal 3 karakter.';
  });

  descInput.addEventListener('input', () => {
    descError.textContent = descInput.validity.valid ? '' : 'Deskripsi harus diisi dan minimal 5 karakter.';
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    const noteId = modal.dataset.noteId;
    const updatedNote = {
      title: titleInput.value.trim(),
      body: descInput.value.trim(),
    };

    try {
      NotesLocal.update(noteId, updatedNote);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Catatan berhasil diupdate.',
        timer: 1200,
        showConfirmButton: false,
      });
      modal.style.display = 'none';
      loadNotes();
      document.dispatchEvent(new CustomEvent('refresh-notes'));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal update!',
        text: error.message || 'Terjadi kesalahan.',
      });
    }
  };
}