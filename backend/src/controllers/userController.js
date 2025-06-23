const prisma = require("../config/prisma");

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
                    }
                },
            },
        })
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getCurrentUserProfile,
}