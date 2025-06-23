const prisma = require("../config/prisma");
const { validationResult, validateComment } = require("../util/validation");

const createComment = [
    validateComment,

    async (req, res) => {
        //Check if validation passed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            await prisma.comment.create({
                data: {
                    text: req.body.text,
                    authorId: req.user.id,
                    postId: req.params.postId,
                },
            });
            res.status(200).send("Comment posted");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    },
];

module.exports = {
    createComment,
};
