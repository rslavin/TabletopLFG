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

export const clearUsername = () => {
    return {
        type: 'CLEAR_USERNAME',
    }
};