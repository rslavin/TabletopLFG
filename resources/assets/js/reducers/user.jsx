const userReducer = (state = {username: null,}, action) => {
    switch (action.type) {
        case 'UPDATE_USERNAME':
            return Object.assign({}, state, { username: action.username });
        case 'CLEAR_USERNAME':
            return Object.assign({}, state, { username: null });
        default:
            return state
    }
};

export default userReducer