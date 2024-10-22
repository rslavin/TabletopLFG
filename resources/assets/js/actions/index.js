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

export const updateUser= (user) => {
    return {
        type: 'UPDATE_USER',
        user: user
    }
};

export const clearUser = () => {
    return {
        type: 'CLEAR_USER',
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

export const updateModal = (attributes) => {
    $("#main-modal").modal();
    return {
        type: "UPDATE",
        attributes: attributes
    }
};

export const closeModal = () => {
    $("#main-modal").modal('hide');
    return {
        type: "CLOSE",
    }
};