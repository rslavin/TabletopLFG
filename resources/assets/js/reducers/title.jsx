const titleReducer = (state = {title: "", subtitle: ""}, action) => {
    switch (action.type) {
        case 'UPDATE_TITLE':
            return Object.assign({}, state, { title: action.title });
        case 'UPDATE_SUBTITLE':
            return Object.assign({}, state, { subtitle: action.subtitle });
        case 'UPDATE_TITLE_AND_SUBTITLE':
            return Object.assign({}, state, {title: action.title, subtitle: action.subtitle });
        default:
            return state
    }
};

export default titleReducer