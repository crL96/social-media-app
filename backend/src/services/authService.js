const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("../config/prisma");
const brycpt = require("bcryptjs");

async function createUser(data) {
    try {
        const hashedPw = await brycpt.hash(data.password, 10);

        await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPw,
                email: data.email,
            },
        });
    } catch {
        throw new Error("Could not create user");
    }
}

async function loginUser(data) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        throw new Error("Incorrect email or password");
    }

    const match = await brycpt.compare(data.password, user.password);
    if (!match) {
        throw new Error("Incorrect email or password");
    }

    const payload = {
        sub: user.id,
        iat: Date.now(),
    };
    const expiresIn = "2d";

    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });
    return { user, signedToken, expiresIn };
}

async function loginGuest() {
    const guest = await prisma.user.findUnique({
        where: {
            username: "Guest",
        },
    });
    // Issue JWT token
    const payload = {
        sub: guest.id,
        iat: Date.now(),
    };
    const expiresIn = "6h";

    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });
    return { signedToken, expiresIn };
}

export { createUser, loginUser, loginGuest };
