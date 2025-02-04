import { createStore, combineReducers } from 'redux';

import titleReducer from './reducers/title';
import userReducer from './reducers/user';
import orgReducer from './reducers/org';
import modalReducer from './reducers/modal';

// Combine Reducers
const reducers = combineReducers({
    titleState: titleReducer,
    userState: userReducer,
    orgState: orgReducer,
    modalState: modalReducer,
});

const store = createStore(reducers);

export default store