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

    const expiresIn = "2d";
    const signedToken = createJwt(user.id, expiresIn);
    return { user, signedToken, expiresIn };
}

async function loginGuest() {
    const guest = await prisma.user.findUnique({
        where: {
            username: "Guest",
        },
    });
    const expiresIn = "6h";
    const signedToken = createJwt(guest.id, expiresIn);
    return { signedToken, expiresIn };
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

export { createUser, loginUser, loginGuest };
