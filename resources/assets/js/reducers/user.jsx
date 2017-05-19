const userReducer = (state = {username: null, isAdmin: false}, action) => {
    switch (action.type) {
        case 'UPDATE_ADMIN':
            return Object.assign({}, state, { isAdmin: action.isAdmin});
        case 'UPDATE_USERNAME':
            return Object.assign({}, state, { username: action.username });
        case 'CLEAR_USER':
            return Object.assign({}, state, { username: null, isAdmin: false});
        default:
            return state
    }
};

export default userReducer