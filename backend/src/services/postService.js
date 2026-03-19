const userRepo = require("../repositories/userRepository");
const postRepo = require("../repositories/postRepository");
const { attachLikedFlagToPosts } = require("../util/postUtils");

async function getFollowingPosts(userId, maxPosts, maxComments) {
    const followList = await userRepo.getIdsForFollowing(userId);
    // Include users own posts in list
    followList.push(userId);

    let posts = await postRepo.getPostsByIdList(
        followList,
        maxPosts,
        maxComments,
    );

    posts = attachLikedFlagToPosts(posts, userId);
    return posts;
}

module.exports = {
    getFollowingPosts,
};
