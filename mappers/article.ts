exports.map = (data) => {
    return {
        id: data.id,
        isPublished: data.isPublished,
        user: {
            id: data.User.id,
            name: data.User.name,
        },
        title: data.CurrentArticleVersion.title,
        description: data.CurrentArticleVersion.description,
    }
};