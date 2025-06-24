const prisma = require("../config/prisma");

async function checkPostOwnership(req, res, next) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.postId,
            },
            select: {
                authorId: true,
            },
        });
        if (post === null) {
            res.status(404).send("No post found");
            return;
        }
        if (post.authorId === req.user.id) {
            next();
        } else {
            res.status(403).send("Not authorized to edit this resource");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    checkPostOwnership,
}
