import { getAllNotes, getArchivedNotes } from '../api.js';

class NoteSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .search-container {
          margin: 20px auto;
          width: 70%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"] {
          padding: 15px;
          width: 70%;
          border-radius: 5px;
          border: 1px solid #ccc;
          margin-right: 10px;
          outline: none;
          transition: box-shadow 0.3s;
        }

        input[type="text"]:focus {
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }

        button[type="submit"] {
          padding: 15px;
          background-color: #627254;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button[type="submit"]:hover {
          background-color: #B3D8A8;
        }
      </style>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Search...">
        <button type="submit" id="searchButton">Search</button>
      </div>
    `;
  }

  connectedCallback() {
    const searchInput = this.shadowRoot.getElementById('searchInput');
    const searchButton = this.shadowRoot.getElementById('searchButton');

    searchButton.addEventListener('click', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      this.searchNotes(keyword);
    });

    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      this.searchNotes(keyword);
    });
  }

  async searchNotes(keyword) {
    try {

      const [activeResult, archivedResult] = await Promise.all([
        getAllNotes(),
        getArchivedNotes(),
      ]);

      const allNotes = [...activeResult.data, ...archivedResult.data];

      const filtered = allNotes.filter(note =>
        note.title.toLowerCase().includes(keyword) ||
        note.body.toLowerCase().includes(keyword)
      );

      this.dispatchEvent(new CustomEvent('search-result', {
        detail: filtered,
        bubbles: true,
        composed: true,
      }));
    } catch (error) {
      console.error('Gagal mencari catatan:', error);
    }
  }
}

customElements.define('note-search', NoteSearch);
