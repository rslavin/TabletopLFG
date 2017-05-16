import { createStore, combineReducers } from 'redux';

import titleReducer from './reducers/title';
import userReducer from './reducers/user';

// Combine Reducers
const reducers = combineReducers({
    titleState: titleReducer,
    userState: userReducer,
});

const store = createStore(reducers);

export default store