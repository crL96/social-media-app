const prisma = require("../config/prisma");
const { validationResult, validateUserProfile } = require("../util/validation");
const service = require("../services/userService");

async function getCurrentUserProfile(req, res) {
    try {
        const user = await service.getUserProfileById(req.user.id);
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getUserProfile(req, res) {
    try {
        const user = await service.getUserProfileByUsername(
            req.params.username,
            req.user.id,
        );

        if (user == null) res.status(404).send("No user found");

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
                    "Include either one or both of 'desc' or 'imgUrl' in body",
                );
                return;
            }

            await service.updateUser(
                req.user.id,
                req.body.desc,
                req.body.imgUrl,
            );
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
                    _count: "desc",
                },
            },
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
                    notIn: excludeList,
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
                    _count: "desc",
                },
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
