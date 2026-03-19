function attachLikedFlagToPosts(posts, userId) {
    return posts.map((post) => {
        if (post.likes.some((user) => user.id === userId)) {
            post.liked = true;
        } else {
            post.liked = false;
        }
        delete post.likes;
        return post;
    });
}

module.exports = {
    attachLikedFlagToPosts,
};
