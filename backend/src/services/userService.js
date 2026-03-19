const repo = require("../repositories/userRepository");
const { attachLikedFlagToPosts } = require("../util/postUtils");

async function getUserProfileById(id) {
    try {
        const user = await repo.getUserProfileById(id);

        user.posts = attachLikedFlagToPosts(user.posts, id);

        return user;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function getUserProfileByUsername(username, currentUserId) {
    try {
        const user = await repo.getUserProfileByUsername(username);

        if (user === null) return null;

        // Check if current user is following, then remove follower list before res
        if (user.followedBy.some((follower) => follower.id === currentUserId)) {
            user.following = true;
        } else {
            user.following = false;
        }
        delete user.followedBy;

        user.posts = attachLikedFlagToPosts(user.posts, currentUserId);

        return user;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function updateUser(id, desc, imgUrl) {
    try {
        await repo.updateUser(id, desc, imgUrl);
    } catch (err) {
        throw err;
    }
}

async function searchUsers(searchTerm, currentUsername) {
    let users = await repo.searchUsersByUsername(searchTerm);
    users = users.filter((user) => user.username !== currentUsername);
    return users;
}

async function getSuggestedProfiles(currentUserId, maxCount = null) {
    const excludeList = await repo.getIdsForFollowing(currentUserId);
    excludeList.push(currentUserId);

    const users = await repo.getUsersNotExcluded(excludeList, maxCount);
    return users;
}

module.exports = {
    getUserProfileById,
    getUserProfileByUsername,
    updateUser,
    searchUsers,
    getSuggestedProfiles,
};
