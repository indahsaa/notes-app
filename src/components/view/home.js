import Utils from '../../script/utils.js';
import NotesData from '../../script/notesData.js';

const home = () => {
    const noteListContainerElement = document.querySelector('#noteListContainer');
    const noteListElement = noteListContainerElement.querySelector('note-list');

    const showSportNote = () => {
        const result = NotesData.getAll();
        displayResult(result);
        showNoteList();
    };

    const displayResult = (notes) => {
        const noteItemElements = notes.map((note) => {
            const noteItemElement = document.createElement('note-item');
            noteItemElement.note = note;

            return noteItemElement;
        })

        Utils.emptyElement(noteListElement)
        noteListElement.append(...noteItemElements)
    };

    const showNoteList = () => {
        Array.from(noteListContainerElement.children).forEach((element) => {
            Utils.hideElement(element);
        });
        Utils.showElement(noteListElement);
    };

    showSportNote();
};

export default home;
