const jwt = require("jsonwebtoken");
require("dotenv").config();
const brycpt = require("bcryptjs");
const persistence = require("../persistence/userPersistence");

async function createUser(data) {
    try {
        const hashedPw = await brycpt.hash(data.password, 10);

        await persistence.createUser(data.username, data.email, hashedPw);
    } catch (err) {
        throw err;
    }
}

async function loginUser(data) {
    const user = await persistence.getUserByEmail(data.email);

    if (!user) {
        throw new Error("Incorrect email or password");
    }

    const match = await brycpt.compare(data.password, user.password);
    if (!match) {
        throw new Error("Incorrect email or password");
    }

    const expiresIn = "2d";
    const signedToken = createJwt(user.id, expiresIn);
    return { user, signedToken, expiresIn };
}

async function loginGuest() {
    const guest = await persistence.getUserByUsername("Guest");
    const expiresIn = "6h";
    const signedToken = createJwt(guest.id, expiresIn);
    return { guest, signedToken, expiresIn };
}

function createJwt(id, expiresIn) {
    const payload = {
        sub: id,
        iat: Date.now(),
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });
}

module.exports = { createUser, loginUser, loginGuest };
