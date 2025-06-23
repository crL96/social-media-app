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

async function getUserProfile(req , res) {
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
                    }
                },
            },
        });

        if (user === null) {
            res.status(404).send("No user found");
            return;
        }

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
                res.status(400).send("Include either one or both of 'desc' or 'imgUrl' in body")
                return;
            }
    
            const user = await prisma.user.update({
                where: {
                    id: req.user.id,
                },
                data: {
                    desc: req.body.desc,
                    imgUrl: req.body.imgUrl,
                }
            })
            res.status(200).send("User profile updated");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    }
];

module.exports = {
    getCurrentUserProfile,
    getUserProfile,
    updateUserProfile,
}