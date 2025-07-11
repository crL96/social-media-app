const prisma = require("../config/prisma");
const { validationResult, validateUserProfile } = require("../util/validation");

async function getCurrentUserProfile(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
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

        // For each post check if current user has liked, then remove likes list before response
        user.posts.map((post) => {
            if (post.likes.some(user => user.id === req.user.id)) {
                post.liked = true;
            } else {
                post.liked = false;
            }
            delete post.likes;
        });

        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getUserProfile(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.params.username,
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
        
        if (user === null) {
            res.status(404).send("No user found");
            return;
        }

        // Check if current user is following, then remove follower list before res
        if (user.followedBy.some(follower => follower.id === req.user.id)) {
            user.following = true;
        } else {
            user.following = false;
        }
        delete user.followedBy;

        // For each post check if current user has liked, then remove likes list before response
        user.posts.map((post) => {
            if (post.likes.some(user => user.id === req.user.id)) {
                post.liked = true;
            } else {
                post.liked = false;
            }
            delete post.likes;
        });

        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

const updateUserProfile = [
    validateUserProfile,

    async (req, res) => {
        //Check if validation passed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            if (!req.body || !(req.body.desc || req.body.imgUrl)) {
                res.status(400).send(
                    "Include either one or both of 'desc' or 'imgUrl' in body"
                );
                return;
            }

            const user = await prisma.user.update({
                where: {
                    id: req.user.id,
                },
                data: {
                    desc: req.body.desc,
                    imgUrl: req.body.imgUrl,
                },
            });
            res.status(200).send("User profile updated");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    },
];

async function searchUsers(req, res) {
    try {
        let users = await prisma.user.findMany({
            where: {
                username: {
                    contains: req.params.searchterm,
                    mode: "insensitive",
                },
            },
            select: {
                username: true,
                desc: true,
                imgUrl: true,
                _count: {
                    select: {
                        followedBy: true,
                    },
                },
            },
            orderBy: {
                followedBy: {
                    _count: "desc"
                }
            }
        });
        // Filter out current user from list
        users = users.filter((user) => user.username !== req.user.username);

        res.json({
            count: users.length,
            users: users,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getSuggestedProfiles(req, res) {
    try {
        // Get a list of user id's current user is following
        // to avoid suggesting users already following
        const { following } = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                following: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const excludeList = following.map((item) => item.id);
        excludeList.push(req.user.id);

        // Return a list of users the current user isnt following
        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn: excludeList
                }
            },
            select: {
                username: true,
                desc: true,
                imgUrl: true,
                _count: {
                    select: {
                        followedBy: true,
                    },
                },
            },
            orderBy: {
                followedBy: {
                    _count: "desc"
                }
            },
            //if max query param is included, return max number, else no all matches
            take: req.query.max ? Number(req.query.max) : undefined,
        });

        res.json(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getCurrentUserProfile,
    getUserProfile,
    updateUserProfile,
    searchUsers,
    getSuggestedProfiles,
};
