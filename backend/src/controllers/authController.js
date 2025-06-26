const prisma = require("../config/prisma");
const brycpt = require("bcryptjs");
const { validationResult, validateUser } = require("../util/validation");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

async function loginUser(req, res) {
    try {
        const message = "Incorrect email or password";

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            res.status(401).send(message);
            return;
        }
        const match = await brycpt.compare(req.body.password, user.password);
        if (!match) {
            res.status(401).send(message);
            return;
        }
        // Since user exists and pw matches, issue JWT
        const payload = {
            sub: user.id,
            iat: Date.now(),
        };
        const expiresIn = "2d";

        const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: expiresIn,
        });
        res.json({
            token: "Bearer " + signedToken,
            expires: expiresIn,
            username: user.username,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    createUser,
    loginUser,
};
