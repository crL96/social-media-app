const authRouter = require("../src/routes/auth");
const prisma = require("../src/config/prisma");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/", authRouter);

// DB Cleanup
afterAll(async () => {
    await prisma.user.deleteMany();
});
beforeEach(async () => {
    await prisma.user.deleteMany();
})


// SIGN UP
test("sign-up route returns 400 if no body attached", (done) => {
    request(app).post("/sign-up")
        .expect(400, done);
});

test("sign-up route return 200 on success", (done) => {
    request(app)
        .post("/sign-up")
        .type("application/json")
        .send({
            email: "test123@gmail.com",
            username: "test123",
            password: "test123",
            confPassword: "test123",
        })
        .expect(200, done);
});

test("sign-up route return 400 on if username/email is taken", (done) => {
    request(app)
        .post("/sign-up")
        .type("application/json")
        .send({
            email: "test123@gmail.com",
            username: "test123",
            password: "test123",
            confPassword: "test123",
        })
        .expect(200)
        .then(() => {
            request(app)
                .post("/sign-up")
                .type("application/json")
                .send({
                    email: "test123@gmail.com",
                    username: "test123",
                    password: "test123",
                    confPassword: "test123",
                })
                .expect(400, done);
        })
});

test("sign-up route return 400 if invalid email", (done) => {
    request(app)
        .post("/sign-up")
        .type("application/json")
        .send({
            email: "test123",
            username: "test123",
            password: "test123",
            confPassword: "test123",
        })
        .expect(400, done);
});

test("sign-up route return 400 if confPassword doesnt match", (done) => {
    request(app)
        .post("/sign-up")
        .type("application/json")
        .send({
            email: "test123@gmail.com",
            username: "test123",
            password: "test123",
            confPassword: "test",
        })
        .expect(400, done);
});

// LOG IN
test("login sucess returns 200 and bearer token", (done) => {
    request(app)
        .post("/sign-up")
        .type("application/json")
        .send({
            email: "test123@gmail.com",
            username: "test123",
            password: "test123",
            confPassword: "test123",
        })
        .expect(200)
        .then(() => {
            request(app)
                .post("/log-in")
                .type("application/json")
                .send({
                    email: "test123@gmail.com",
                    password: "test123",
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            token: expect.any(String),
                            expires: expect.any(String),
                        })
                    )
                }).catch(err => {
                    done(err)
                    return err
                }).then(err => {
                    if (!err) {
                        done();
                    }
                })
                
            })
});

test("login unsuccessful attempt returns 401", (done) => {
        request(app)
            .post("/log-in")
            .type("application/json")
            .send({
                email: "test123@gmail.com",
                password: "test123",
            })
            .expect(401, done);
});
