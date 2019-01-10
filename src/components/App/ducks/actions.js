import axios from 'axios';
import history from '../../../history';
import { receiveFilesActionCreator, receiveRootFilesActionCreator } from '../../Files/ducks/actions';
import { receiveTerminalActionCreator, receiveRootTerminalActionCreator } from '../../Terminal/ducks/actions';

export const RECEIVE_PASTE = 'RECEIVE_PASTE';
export const UPDATE_TITLE = 'UPDATE_TITLE';
export const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION';
export const DONE_SEARCHING = 'DONE_SEARCHING';
export const NOT_FOUND = 'NOT_FOUND';
export const RESET_PASTE = 'RESET_PASTE';

export const resetPasteActionCreator = () => {
  return {
    type: RESET_PASTE,
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

export const receivePasteActionCreator = (paste) => {
  return {
    type: RECEIVE_PASTE,
    paste,
  };
};

export const updateTitleActionCreator = (title) => {
  return {
    type: UPDATE_TITLE,
    title,
  };
};

export const updateDescriptionActionCreator = (description) => {
  return {
    type: UPDATE_DESCRIPTION,
    description,
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
          dispatch(receiveTerminalActionCreator(paste.terminal));
          if (paste.version > 0) {
            dispatch(receiveRootFilesActionCreator(root.files));
            dispatch(receiveRootTerminalActionCreator(root.terminal));
          }
          dispatch(doneSearchingActionCreator());
        })
        .catch((err) => {
          if (err.response) {
            dispatch(doneSearchingActionCreator());
            if (err.response.status === 404) {
              dispatch(notFoundActionCreator());
            }
          }
        });
    } else {
      dispatch(doneSearchingActionCreator());
    }
  };
};

const preparePayload = (state) => {
  const { app, files, terminal } = state;
  const { title, description } = app;

  const newFiles = [];
  files.ids.forEach((id) => {
    newFiles.push(files[id]);
  });

  return {
    title,
    description,
    files: newFiles,
    terminal,
  };
};

export const createPasteThunk = () => {
  return (dispatch, getState) => {
    axios.post('/api/pastes', preparePayload(getState()))
      .then(res => res.data)
      .then((createdPaste) => {
        dispatch(receivePasteActionCreator(createdPaste));
        dispatch(receiveFilesActionCreator(createdPaste.files));
        dispatch(receiveTerminalActionCreator(createdPaste.terminal));
        history.push(`/${createdPaste.short}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const createVersionThunk = () => {
  return (dispatch, getState) => {

    const state = getState();
    const { short } = state.app;

    axios.post(`/api/pastes/${short}`, preparePayload(state))
      .then(res => res.data)
      .then(({ createdPaste, root }) => {
        dispatch(receivePasteActionCreator(createdPaste));
        dispatch(receiveFilesActionCreator(createdPaste.files));
        dispatch(receiveTerminalActionCreator(createdPaste.terminal));
        dispatch(receiveRootFilesActionCreator(root.files));
        dispatch(receiveRootTerminalActionCreator(root.terminal));
        history.push(`/${createdPaste.short}/${createdPaste.version}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
};
