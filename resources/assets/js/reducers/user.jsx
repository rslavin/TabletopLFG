const userReducer = (state = {user: null}, action) => {
    switch (action.type) {
        case 'UPDATE_USER':
            return Object.assign({}, state, {user: action.user});
        case 'CLEAR_USER':
            return Object.assign({}, state, {user: null});
        default:
            return state
    }
};

export default userReducer