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

export { createUser };
