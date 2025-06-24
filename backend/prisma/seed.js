const { PrismaClient } = require("../generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    if (process.env.NODE_ENV !== "development") return;
    console.log("Running seed script");

    // Clean up previous entries before seeding
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    //Create users with posts
    for (let i = 0; i < 25; i++) {
        await prisma.user.create({
            data: {
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                desc: faker.lorem.paragraph(2),
                imgUrl: faker.image.personPortrait({ size: 256 }),
                posts: {
                    create: [
                        {
                            text: faker.lorem.paragraph({ min: 1, max: 3 }),
                        },
                        {
                            text: faker.lorem.paragraph({ min: 1, max: 3 }),
                        },
                    ],
                },
            },
        });
    }

    // Add comments and likes to some of the posts
    for (let i = 0; i < 20; i++) {
        const post = await prisma.post.findFirst({
            where: {
                id: {
                    startsWith: String(
                        Math.floor(Math.random() * 16).toString(16)
                    ),
                },
            },
        });
        if (!post) continue;

        const user = await prisma.user.findFirst({
            where: {
                id: {
                    startsWith: String(
                        Math.floor(Math.random() * 16).toString(16)
                    ),
                },
            },
        });
        if (!user) continue;

        await prisma.post.update({
            where: {
                id: post.id,
            },
            data: {
                likes: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        await prisma.comment.create({
            data: {
                text: faker.lorem.paragraph(1),
                authorId: user.id,
                postId: post.id,
            },
        });
    }
}

main()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Seed script ran successfully");
    });
