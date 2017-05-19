const orgReducer = (state = {orgName: null, orgShortName: null}, action) => {
    switch (action.type) {
        case 'UPDATE_ORG_NAMES':
            return Object.assign({}, state, { orgName: action.orgName , orgShortName: action.orgShortName});
        case 'UPDATE_ORG_SHORT_NAME':
            return Object.assign({}, state, { orgShortName: action.orgShortName });
        case 'UPDATE_ORG_NAME':
            return Object.assign({}, state, { orgName: action.orgName });
        default:
            return state
    }
};

export default orgReducer