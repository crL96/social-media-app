const persistence = require("../persistence/userPersistence");

async function getUserProfileById(id) {
    try {
        const user = await persistence.getUserProfileById(id);

        // For each post check if current user has liked, then remove likes list before response
        user.posts.map((post) => {
            if (post.likes.some((user) => user.id === id)) {
                post.liked = true;
            } else {
                post.liked = false;
            }
            delete post.likes;
        });

        return user;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function getUserProfileByUsername(username, currentUserId) {
    try {
        const user = await persistence.getUserProfileByUsername(username);

        if (user === null) return null;

        // Check if current user is following, then remove follower list before res
        if (user.followedBy.some((follower) => follower.id === currentUserId)) {
            user.following = true;
        } else {
            user.following = false;
        }
        delete user.followedBy;

        // For each post check if current user has liked, then remove likes list before res
        user.posts.map((post) => {
            if (post.likes.some((user) => user.id === currentUserId)) {
                post.liked = true;
            } else {
                post.liked = false;
            }
            delete post.likes;
        });

        return user;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

async function updateUser(id, desc, imgUrl) {
    try {
        await persistence.updateUser(id, desc, imgUrl);
    } catch (err) {
        throw err;
    }
}

module.exports = { getUserProfileById, getUserProfileByUsername, updateUser };
