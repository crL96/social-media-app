const prisma = require("../config/prisma");
const { validationResult, validatePost } = require("../util/validation");

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

async function getPost(req, res) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.postId,
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
                comments: {
                    select: {
                        id: true,
                        text: true,
                        timestamp: true,
                        author: {
                            select: {
                                username: true,
                            }
                        }
                    },
                    orderBy: {
                        timestamp: "desc"
                    },
                    //if max query param is included, return max number, else all comments
                    take: req.query.max ? Number(req.query.max) : undefined,
                }
            },
        })
        if (post === null) {
            res.status(404).send("No post found");
            return;
        }
        res.json(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

createPost = [
    validatePost,

    async (req, res) => {
        //Check if validation passed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            await prisma.post.create({
                data: {
                   text: req.body.text,
                   authorId: req.user.id, 
                }
            });
            res.status(200).send("Post created");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    
    }
];

async function deletePost(req, res) {
    try {
        //Delete post and all its comments
        const deleteComments = prisma.comment.deleteMany({
            where: {
                postId: req.params.postId
            }
        });
        const deletePost = prisma.post.delete({
            where: {
                id: req.params.postId
            },
        });
        await prisma.$transaction([deleteComments, deletePost]);
        res.status(200).send("Post and all of its comments have been deleted")
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function editPost(req, res) {
    if (!req.body || !req.body.text) {
        res.status(400).send("Bad request: Include post text/content as 'text' in req body");
        return;
    }
    try {
        await prisma.post.update({
            where: {
                id: req.params.postId,
            },
            data: {
                text: req.body.text,
            },
        });
        res.status(200).send("Post updated");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function likePost(req, res) {
    try {
        await prisma.post.update({
            where: {
                id: req.params.postId,
            },
            data: {
                likes: {
                    connect: {
                        id: req.user.id,
                    }
                }
            }
        });
        res.status(200).send("Post liked");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function unlikePost(req, res) {
    try {
        await prisma.post.update({
            where: {
                id: req.params.postId,
            },
            data: {
                likes: {
                    disconnect: {
                        id: req.user.id,
                    },
                },
            },
        });
        res.status(200).send("Post unliked");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getFollowingPosts,
    getPost,
    createPost,
    deletePost,
    editPost,
    likePost,
    unlikePost,
}
