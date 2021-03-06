import axios from 'axios';
import history from '../../../history';
import { receiveFilesActionCreator, receiveRootFilesActionCreator } from '../../Files/ducks/actions';
import { receiveNotesActionCreator } from '../../Notes/ducks/actions';

export const RECEIVE_PASTE = 'RECEIVE_PASTE';
export const DONE_SEARCHING = 'DONE_SEARCHING';
export const NOT_FOUND = 'NOT_FOUND';
export const SERVER_ERROR = 'SERVER_ERROR';
export const RESET_PASTE = 'RESET_PASTE';
export const TOGGLE_TUTORIAL = 'TOGGLE_TUTORIAL';

export const resetPasteActionCreator = () => {
  return {
    type: RESET_PASTE,
  };
};

export const serverErrorActionCreator = () => {
  return {
    type: SERVER_ERROR,
  };
};

export const notFoundActionCreator = () => {
  return {
    type: NOT_FOUND,
  };
};

export const doneSearchingActionCreator = () => {
  return {
    type: DONE_SEARCHING,
  };
};

export const toggleTutorialActionCreator = () => {
  return {
    type: TOGGLE_TUTORIAL,
  };
};


export const receivePasteActionCreator = (paste) => {
  return {
    type: RECEIVE_PASTE,
    paste,
  };
};

export const getPasteThunk = (short, version = '') => {
  return (dispatch) => {
    if (short || version) {
      axios.get(`/api/pastes/${short}/${version}`)
        .then(res => res.data)
        .then(({ root, paste }) => {
          dispatch(receivePasteActionCreator(paste));
          dispatch(receiveFilesActionCreator(paste.files));
          dispatch(receiveNotesActionCreator(paste.notes));
          if (paste.version > 0) {
            dispatch(receiveRootFilesActionCreator(root.files));
          }
          dispatch(doneSearchingActionCreator());
        })
        .catch((err) => {
          if (err.response) {
            dispatch(doneSearchingActionCreator());
            if (err.response.status === 404) {
              dispatch(notFoundActionCreator());
            } else {
              dispatch(serverErrorActionCreator());
            }
          }
        });
    } else {
      dispatch(doneSearchingActionCreator());
    }
  };
};

const preparePayload = (state) => {
  const { app, files, notes } = state;

  const newFiles = [];
  files.ids.forEach((id) => {
    const file = files[id];
    newFiles.push({
      _id: file._id,
      title: file.title,
      body: file.body,
      syntax: file.syntax,
    });
  });

  return {
    files: newFiles,
    notes: {
      _id: notes.body,
      body: notes.body,
    },
  };
};

export const createPasteThunk = () => {
  return (dispatch, getState) => {
    return axios.post('/api/pastes', preparePayload(getState()))
      .then(res => res.data)
      .then((createdPaste) => {
        dispatch(receivePasteActionCreator(createdPaste));
        dispatch(receiveFilesActionCreator(createdPaste.files));
        dispatch(receiveNotesActionCreator(createdPaste.notes));
        history.push(`/${createdPaste.short}`);
      });
  };
};

export const createVersionThunk = () => {
  return (dispatch, getState) => {

    const state = getState();
    const { short } = state.app;

    return axios.post(`/api/pastes/${short}`, preparePayload(state))
      .then(res => res.data)
      .then(({ createdPaste, root }) => {
        dispatch(receivePasteActionCreator(createdPaste));
        dispatch(receiveFilesActionCreator(createdPaste.files));
        dispatch(receiveNotesActionCreator(createdPaste.notes));
        dispatch(receiveRootFilesActionCreator(root.files));
        history.push(`/${createdPaste.short}/${createdPaste.version}`);
      });
  };
};
