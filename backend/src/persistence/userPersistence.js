const prisma = require("../config/prisma");

async function getUserProfileById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            email: true,
            username: true,
            desc: true,
            imgUrl: true,
            _count: {
                select: {
                    posts: true,
                    followedBy: true,
                    following: true,
                },
            },
            posts: {
                select: {
                    id: true,
                    text: true,
                    timestamp: true,
                    author: {
                        select: {
                            username: true,
                            imgUrl: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                    // Include to check if current user has liked
                    likes: {
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    timestamp: "desc",
                },
            },
        },
    });
    return user;
}

async function getUserProfileByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            desc: true,
            imgUrl: true,
            _count: {
                select: {
                    posts: true,
                    followedBy: true,
                    following: true,
                },
            },
            posts: {
                select: {
                    id: true,
                    text: true,
                    timestamp: true,
                    author: {
                        select: {
                            username: true,
                            imgUrl: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                    // Include to check if current user has liked
                    likes: {
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    timestamp: "desc",
                },
            },
            //Include to be able to check if current user is following or not
            followedBy: {
                select: {
                    id: true,
                },
            },
        },
    });
    return user;
}

async function updateUser(id, desc, imgUrl) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                desc: desc,
                imgUrl: imgUrl,
            },
        });
    } catch {
        throw new Error("Failed to update user");
    }
}

module.exports = { getUserProfileById, getUserProfileByUsername, updateUser };
