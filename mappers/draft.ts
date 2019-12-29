exports.map = (data) => {
    return {
        id: data.id,
        user: {
            id: data.User.id,
            name: data.User.name,
        },
        title: data.title,
        description: data.description,
    }
};