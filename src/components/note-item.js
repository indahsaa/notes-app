import NotesLocal from '../script/notesLocal.js';

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .card {
          background: #F8FAFC; 
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
          height: 100%;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        h3 {
          margin: 0 0 8px 0;
          color: #003C43;
          font-size: 1.1rem;
        }

        .content {
          margin-bottom: 8px;
          color: #405D72;
          font-size: 0.9rem;
          white-space: pre-line;
        }

        small {
          display: block;
          color: #777;
          font-size: 0.8rem;
          margin-bottom: 12px;
        }

        .note-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        button {
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .archive-btn {
          background: #fff8e1;
          color: #ff8f00;
        }

        .delete-btn {
          background: #ffebee;
          color: #d32f2f;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: none;
          animation: spin 1s linear infinite;
          transform-origin: center;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .notes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .notes-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="card">
        <h3>${this._note.title}</h3>
        <div class="content">${this._formatBody(this._note.body)}</div>
        <small>${new Date(this._note.createdAt).toLocaleString()}</small>
        <div class="note-actions">
          <button class="archive-btn" data-loading="false">
            <span class="button-text">
              <i class="fa-solid fa-box-archive"></i> ${this._note.archived ? 'Unarchive' : 'Archive'}
            </span>
            <i class="fa-solid fa-spinner loading-spinner"></i>
          </button>
          <button class="edit-btn">
            <span class="button-text">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </span>
          </button>
          <button class="delete-btn" data-loading="false">
            <span class="button-text">
              <i class="fa-solid fa-trash"></i> Delete
            </span>
            <i class="fa-solid fa-spinner loading-spinner"></i>
          </button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => this.handleArchive());
    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => this.handleDelete());
    this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => this.handleEdit());
  }
  
  handleEdit() {
    this.dispatchEvent(new CustomEvent('edit-note', {
      bubbles: true,
      composed: true,
      detail: { note: this._note }
    }));
  }

  async handleArchive() {
    const button = this.shadowRoot.querySelector('.archive-btn');
    if (button.getAttribute('data-loading') === 'true') return;

    try {
      this.toggleLoading(button, true);

      const archived = !this._note.archived;
      NotesLocal.update(this._note.id, { archived });
      this._note.archived = archived;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Catatan berhasil ${archived ? 'diarsipkan' : 'dikeluarkan dari arsip'}.`,
        timer: 1200,
        showConfirmButton: false,
      });

      this.dispatchEvent(new CustomEvent(archived ? 'note-archived' : 'note-unarchived', {
        bubbles: true,
        composed: true,
        detail: {
          noteId: this._note.id,
          archived
        }
      }));
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: `Gagal mengubah arsip: ${error.message}`,
      });
    } finally {
      this.toggleLoading(button, false);
    }
  }

  async handleDelete() {
    const button = this.shadowRoot.querySelector('.delete-btn');
    if (button.getAttribute('data-loading') === 'true') return;

    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: "Catatan akan dihapus permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus'
    });

    if (!result.isConfirmed) return;

    try {
      this.toggleLoading(button, true);

      NotesLocal.delete(this._note.id);

      await Swal.fire({
        icon: 'success',
        title: 'Terhapus',
        text: 'Catatan sudah dihapus.',
        timer: 1200,
        showConfirmButton: false,
      });

      this.dispatchEvent(new CustomEvent('note-deleted', {
        bubbles: true,
        composed: true,
        detail: { noteId: this._note.id }
      }));

      this.remove();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: `Gagal menghapus: ${error.message}`,
      });
    } finally {
      this.toggleLoading(button, false);
    }
  }
 

  toggleLoading(button, isLoading) {
    button.setAttribute('data-loading', isLoading);
    button.disabled = isLoading;
    button.querySelector('.button-text').style.display = isLoading ? 'none' : 'flex';
    button.querySelector('.loading-spinner').style.display = isLoading ? 'inline-block' : 'none';
  }

  _formatBody(body) {
    return body.includes('\n')
      ? body.split('\n').map(line => `<p>${line}</p>`).join('')
      : body;
  }
}

customElements.define('note-item', NoteItem);