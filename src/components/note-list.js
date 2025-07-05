import NotesLocal from '../script/notesLocal.js';

class NoteList extends HTMLElement {
  connectedCallback() {
    this.render();

    this.addEventListener('note-archived', async () => {
      document.dispatchEvent(new CustomEvent('refresh-notes'));
    });

    this.addEventListener('note-unarchived', () => {
      document.dispatchEvent(new CustomEvent('refresh-notes'));
    });

    this.addEventListener('note-deleted', async () => {
      await this.render();
    });

    document.addEventListener('refresh-notes', async () => {
      await this.render();
    });

    document.addEventListener('search-result', (event) => {
      this.handleSearchResult(event.detail);
    });
  }

  async render() {
    this.innerHTML = '<p style="text-align:center;padding:1rem;">Loading...</p>';

    const isArchived = this.getAttribute('data-archived') === 'true';
    const notes = isArchived ? NotesLocal.getArchived() : NotesLocal.getActive();
    this.displayNotes(notes);
  }

  handleSearchResult(results) {
    const isArchived = this.getAttribute('data-archived') === 'true';
    const filteredNotes = results.filter(note => note.archived === isArchived);
    this.displayNotes(filteredNotes);
  }

  displayNotes(notes) {
    this.innerHTML = '';

    if (!Array.isArray(notes) || notes.length === 0) {
      this.innerHTML = `
        <p class="empty-message" style="
          text-align: center;
          margin: 2rem 0;
          font-style: italic;
          color: #666;
          padding: 1rem;
        ">
          ${this.getAttribute('data-archived') === 'true' 
            ? '📦 Tidak ada catatan yang diarsipkan' 
            : '📝 Tidak ada catatan'}
        </p>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
    grid.style.gap = '1.5rem';
    grid.style.padding = '1rem';
    grid.style.maxWidth = '1200px';
    grid.style.margin = '0 auto';

    notes.forEach(note => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;
      grid.appendChild(noteItemElement);
    });

    this.appendChild(grid);
  }
}

customElements.define('note-list', NoteList);