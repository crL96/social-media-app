const prisma = require("../config/prisma");

async function getFollowingPosts(req, res) {
    try {
        // Get list of users followed
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
        const followList = following.map((item) => item.id);
        // Include users own posts in list
        followList.push(req.user.id);

        //Get list of posts from followed users
        const posts = await prisma.post.findMany({
            where: {
                authorId: {
                    in: followList,
                }
            },
            select: {
                id: true,
                text: true,
                timestamp: true,
                author: {
                    select: {
                        username: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                },
            },
            orderBy: {
                timestamp: "desc"
            },
            //if max query param is included, return max number, else all matches
            take: req.query.max ? Number(req.query.max) : undefined,
        });
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getFollowingPosts,
}
