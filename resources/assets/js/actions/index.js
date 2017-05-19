export const updateTitle = (title) => {
    return {
        type: 'UPDATE_TITLE',
        title: title
    }
};

export const updateSubtitle = (subtitle) => {
    return {
        type: 'UPDATE_SUBTITLE',
        subtitle: subtitle
    }
};

export const updateTitleAndSubtitle = (title, subtitle) => {
    return {
        type: 'UPDATE_TITLE_AND_SUBTITLE',
        title: title,
        subtitle: subtitle
    }
};

export const updateUsername = (username) => {
    return {
        type: 'UPDATE_USERNAME',
        username: username
    }
};

export const updateAdmin = (admin) => {
    return {
        type: 'UPDATE_ADMIN',
        isAdmin: admin
    }
};

export const clearUser = () => {
    return {
        type: 'CLEAR_USER',
        isAdmin: false
    }
};

export const updateOrgShortName = (shortName) => {
    return {
        type: 'UPDATE_ORG_SHORT_NAME',
        orgShortName: shortName
    }
};

export const updateOrgName = (name) => {
    return {
        type: 'UPDATE_ORG_NAME',
        orgName: name
    }
};

export const updateOrgNames = (name, shortName) => {
    return {
        type: 'UPDATE_ORG_NAMES',
        orgName: name,
        orgShortName: shortName
    }
};