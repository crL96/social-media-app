const prisma = require("../config/prisma");

async function getPostsByIdList(idList, maxPosts = undefined, maxComments = 0) {
    const posts = await prisma.post.findMany({
        where: {
            authorId: {
                in: idList,
            },
        },
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
            comments: {
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
                },
                orderBy: {
                    timestamp: "desc",
                },
                take: maxComments,
                //if comments query param is included, return max number, else no comments
                take: maxComments ? Number(maxComments) : 0,
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
        //if max query param is included, return max number, else all matches
        take: maxPosts ? Number(maxPosts) : undefined,
    });
    return posts;
}

module.exports = {
    getPostsByIdList,
};
