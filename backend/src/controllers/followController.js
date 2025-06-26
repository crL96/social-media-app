const prisma = require("../config/prisma");

async function followUser(req, res) {
    if (req.params.username === req.user.username) {
        res.status(400).send("Can't follow yourself");
        return;
    }

    try {
        await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                following: {
                    connect: {
                        username: req.params.username,
                    },
                },
            },
        });
        res.status(200).send("Now following " + req.params.username);
    } catch (err) {
        if (err.message.startsWith("\nInvalid `prisma.user.update")) {
            res.status(404).send("No user found with requested username");
            return;
        }
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function unfollowUser(req, res) {
    if (req.params.username === req.user.username) {
        res.status(400).send("Can't follow yourself");
        return;
    }

    try {
        await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                following: {
                    disconnect: {
                        username: req.params.username,
                    },
                },
            },
        });
        res.status(200).send("Unfollowed " + req.params.username);
    } catch (err) {
        if (err.message.startsWith("\nInvalid `prisma.user.update")) {
            res.status(404).send("No user found with requested username");
            return;
        }
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getFollowList(req, res) {
    try {
        const list = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                following: {
                    select: {
                        username: true,
                        imgUrl: true,
                    },
                },
                followedBy: {
                    select: {
                        username: true,
                        imgUrl: true,
                    },
                },
            },
        });
        res.json(list);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getFollowListByName(req, res) {
    try {
        const list = await prisma.user.findUnique({
            where: {
                username: req.params.username,
            },
            select: {
                following: {
                    select: {
                        username: true,
                        imgUrl: true,
                    },
                },
                followedBy: {
                    select: {
                        username: true,
                        imgUrl: true,
                    },
                },
            },
        });
        res.json(list);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowList,
    getFollowListByName,
};
