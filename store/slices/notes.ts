import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Note, User} from '../../types';
import {randomId} from '../../src/service/fn';

type NotesSlice = {
  notes: Record<string, {data?: Note[]}>;
};

const initialState: NotesSlice = {
  notes: {},
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    initializeUserNotes: (state, action: PayloadAction<User['_id']>) => {
      const uid = action.payload;
      if (!state.notes[uid]) {
        state.notes[uid] = {data: []};
      }
    },

    createNote: (
      state,
      action: PayloadAction<{
        uid: User['_id'];
        note: {
          title: string;
          content: string;
          hashtags?: string[];
          media?: {
            url: string;
            type: 'image' | 'video' | 'audio' | 'mixed';
            alt?: string;
          }[];
        };
      }>,
    ) => {
      const {uid, note} = action.payload;
      const newNote: Note = {
        ...note,
        _id: randomId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
        isDeleted: false,
        isFavorite: false,
        isPinned: false,
        isDraft: false,
        deletedAt: undefined,
        sharedWith: [],
        media: note.media || [],
        hashtags: note.hashtags || [],
      };
      if (!state.notes[uid] || !state.notes[uid].data) {
        state.notes[uid] = {data: [newNote]};
      } else {
        state.notes[uid].data.unshift(newNote);
      }
    },

    deleteNote: (
      state,
      action: PayloadAction<{
        uid: string;
        noteId: string;
      }>,
    ) => {
      const {uid, noteId} = action.payload;

      const userNotes = state.notes[uid];
      if (!userNotes || !userNotes.data) return;

      const noteIndex = userNotes.data.findIndex(note => note._id === noteId);
      if (noteIndex === -1) return;

      const note = userNotes.data[noteIndex];
      userNotes.data[noteIndex] = {
        ...note,
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      };
    },
 restoreNote: (
      state,
      action: PayloadAction<{uid: string; noteId: string}>,
    ) => {
      const {uid, noteId} = action.payload;
      const userNotes = state.notes[uid];
      if (!userNotes || !userNotes.data) return;

      const note = userNotes.data.find(n => n._id === noteId);
      if (!note || !note.isDeleted) return;

      note.isDeleted = false;
      note.deletedAt = undefined;
      note.updatedAt = new Date();
    },

    setToFavorite: (
      state,
      action: PayloadAction<{uid: string; noteId: string; favorite: boolean}>,
    ) => {
      const {uid, noteId, favorite} = action.payload;
      const userNotes = state.notes[uid];
      if (!userNotes) return;

      const note = userNotes.data?.find(n => n._id === noteId);
      if (!note) return;

      note.isFavorite = favorite;
      note.updatedAt = new Date();
    },

    pinNote: (
      state,
      action: PayloadAction<{uid: string; noteId: string; pinned: boolean}>,
    ) => {
      const {uid, noteId, pinned} = action.payload;
      const userNotes = state.notes[uid];
      if (!userNotes || !userNotes.data) return;

      const note = userNotes.data.find(n => n._id === noteId);
      if (!note) return;

      note.isPinned = pinned;
      note.updatedAt = new Date();
    },
    archiveNote: (
      state,
      action: PayloadAction<{uid: string; noteId: string; archived: boolean}>,
    ) => {
      const {uid, noteId, archived} = action.payload;
      const userNotes = state.notes[uid];
      if (!userNotes || !userNotes.data) return;

      const note = userNotes.data.find(n => n._id === noteId);
      if (!note) return;

      note.isArchived = archived;
      note.updatedAt = new Date();
    },
   
    permanentlyDeleteNote: (
      state,
      action: PayloadAction<{uid: string; noteId: string}>,
    ) => {
      const {uid, noteId} = action.payload;
      const userNotes = state.notes[uid];
      if (!userNotes || !userNotes.data) return;

      userNotes.data = userNotes.data.filter(note => note._id !== noteId);
    },
    updateNote: (
      state,
      action: PayloadAction<{
        uid: string;
        noteId: string;
        updates: Partial<
          Pick<
            Note,
            'title' | 'content' | 'hashtags' | 'media' | 'color' | 'isDraft'
          >
        >;
      }>,
    ) => {
      const {uid, noteId, updates} = action.payload;
      const userNotes = state.notes[uid];

      if (!userNotes || !userNotes.data) return;

      const index = userNotes.data.findIndex(note => note._id === noteId);
      if (index === -1) return;
      const originalNote = userNotes.data[index];
      const updatedNote: Note = {
        ...originalNote,
        ...updates,
        updatedAt: new Date(),
        createdAt: originalNote.createdAt,
      };
      userNotes.data.splice(index, 1);
      userNotes.data.unshift(updatedNote);
    },

    saveToDraft: (
      state,
      action: PayloadAction<{
        uid: string;
        note: {
          title: string;
          content: string;
          hashtags?: string[];
          media?: {
            url: string;
            type: 'image' | 'video' | 'audio' | 'mixed';
            alt?: string;
          }[];
        };
      }>,
    ) => {
      const {uid, note} = action.payload;
      const userNotes = state.notes[uid]?.data;
      if (!userNotes) {
        state.notes[uid] = {
          data: [
            {
              ...note,
              _id: randomId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              isArchived: false,
              isDeleted: false,
              isFavorite: false,
              isPinned: false,
              isDraft: true,
              deletedAt: undefined,
              sharedWith: [],
              media: note.media || [],
              hashtags: note.hashtags || [],
            },
          ],
        };
        return;
      }
      const existingDraft = userNotes.find(
        n => n.title.trim() === note.title.trim() && n.isDraft,
      );

      if (existingDraft) {
        existingDraft.content = note.content;
        existingDraft.hashtags = note.hashtags || [];
        existingDraft.media = note.media || [];
        existingDraft.updatedAt = new Date();
      } else {
        userNotes.unshift({
          ...note,
          _id: randomId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isArchived: false,
          isDeleted: false,
          isFavorite: false,
          isPinned: false,
          isDraft: true,
          deletedAt: undefined,
          sharedWith: [],
          media: note.media || [],
          hashtags: note.hashtags || [],
        });
      }
    },
  },
});

export const {
  initializeUserNotes,
  updateNote,
  permanentlyDeleteNote,
  deleteNote,
  archiveNote,
  pinNote,
  createNote,
  setToFavorite,
  saveToDraft,
  restoreNote
} = noteSlice.actions;
export default noteSlice.reducer;

// function updateNoteFlag(
//   notes: Record<string, { data: Note[] }>,
//   uid: string,
//   noteId: string,
//   field: keyof Pick<Note, 'isPinned' | 'isFavorite' | 'isArchived'>,
//   value: boolean
// ) {
//   const userNotes = notes[uid];
//   if (!userNotes) return;
//   const note = userNotes.data.find(n => n._id === noteId);
//   if (!note) return;
//   note[field] = value;
//   note.updatedAt = new Date();
// }

// pinNote: (state, action: PayloadAction<{ uid: string; noteId: string; pinned: boolean }>) => {
//   updateNoteFlag(state.notes, action.payload.uid, action.payload.noteId, 'isPinned', action.payload.pinned);
// },
