const modalReducer = (state = {attributes: {body: "", title: "", open: false, style: null}}, action) => {
    switch (action.type) {
        case 'UPDATE':
            return Object.assign({}, state, {attributes: action.attributes});
        case "CLOSE":
            return Object.assign({}, state, {attributes: {body: "", title: "", open: false, style: null}});
        default:
            return state
    }
};

export default modalReducer