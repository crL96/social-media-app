const { validationResult, validateUser } = require("../util/validation");
const authService = require("../services/authService");

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
            await authService.createUser(req.body);
            res.status(200).send("User created");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    },
];

async function loginUser(req, res) {
    try {
        const { user, signedToken, expiresIn } = await authService.loginUser(
            req.body,
        );
        res.json({
            token: "Bearer " + signedToken,
            expires: expiresIn,
            username: user.username,
        });
    } catch (err) {
        res.status(401).send(err.Message);
    }
}

async function guestLogin(req, res) {
    try {
        const { signedToken, expiresIn } = await authService.loginGuest();
        res.json({
            token: "Bearer " + signedToken,
            expires: expiresIn,
            username: "Guest",
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    createUser,
    loginUser,
    guestLogin,
};
