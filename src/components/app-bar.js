class AppBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      // Ambil nama user dari localStorage jika ada, fallback ke attribute/data-user-name
      this.userName = localStorage.getItem('notes-app-v2-user') || this.getAttribute('data-user-name') || 'User';
      // Foto profil default (bisa diganti dengan upload user jika mau)
      this.profilePic = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.userName) + '&background=52be62&color=fff&size=64';
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            background:#52be62;
            color: #fff;
            position: fixed;
            width: 100%;
            padding: 16px 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 100;
          }
          .bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .profile-info {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.08);
            padding: 6px 16px 6px 6px;
            border-radius: 24px;
          }
          .profile-info img {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #fff;
            background: #fff;
          }
          .profile-info .user-name {
            font-weight: 600;
            font-size: 1rem;
            color: #fff;
            letter-spacing: 0.5px;
          }
          @media (max-width: 600px) {
            .profile-info .user-name {
              font-size: 0.95rem;
            }
            .bar h1 {
              font-size: 1.1rem;
            }
          }
        </style>
        <div class="bar">
          <h1>NotesApp</h1>
          <div class="profile-info">
            <img src="${this.profilePic}" alt="Profile" />
            <span class="user-name">${this.userName}</span>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('app-bar', AppBar);
