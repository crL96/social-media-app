const { validationResult, validateUserProfile } = require("../util/validation");
const service = require("../services/userService");

async function getCurrentUserProfile(req, res) {
    try {
        const user = await service.getUserProfileById(req.user.id);
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getUserProfile(req, res) {
    try {
        const user = await service.getUserProfileByUsername(
            req.params.username,
            req.user.id,
        );

        if (user == null) res.status(404).send("No user found");

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
                res.status(400).send(
                    "Include either one or both of 'desc' or 'imgUrl' in body",
                );
                return;
            }

            await service.updateUser(
                req.user.id,
                req.body.desc,
                req.body.imgUrl,
            );
            res.status(200).send("User profile updated");
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Internal server error");
        }
    },
];

async function searchUsers(req, res) {
    try {
        const users = await service.searchUsers(
            req.params.searchterm,
            req.user.username,
        );

        res.json({
            count: users.length,
            users: users,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getSuggestedProfiles(req, res) {
    try {
        const users = await service.getSuggestedProfiles(
            req.user.id,
            req.query.max,
        );

        res.json(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getCurrentUserProfile,
    getUserProfile,
    updateUserProfile,
    searchUsers,
    getSuggestedProfiles,
};
