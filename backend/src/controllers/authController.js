const prisma = require("../config/prisma");
const brycpt = require("bcryptjs");
const { validationResult, validateUser } = require("../util/validation");

const createUser = [
    validateUser,

    async (req, res) => {
        //Check if validation passed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            const hashedPw = await brycpt.hash(req.body.password, 10);

            await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: hashedPw,
                    email: req.body.email,
                },
            });
            res.status(200).send("User created");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    },
];

module.exports = {
    createUser,
};