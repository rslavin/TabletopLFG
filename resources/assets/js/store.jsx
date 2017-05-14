import { createStore, combineReducers } from 'redux';

import titleReducer from './reducers/title';

// Combine Reducers
const reducers = combineReducers({
    titleState: titleReducer,
});

const store = createStore(reducers);

export default store