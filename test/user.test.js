const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("./keys/private.pem", "utf8");
const token = jwt.sign(
  {
    emp_id: "123344",
    username: "kakashi",
    email: "kakashihatake@leaf.com",
  },
  privateKey,
  {
    expiresIn: "0.5h",
    algorithm: "RS256",
  }
);

describe("GET USERS", () => {
  it("should return 401 status code", (done) => {
    request(app).get("/api/users/getAllUsers").expect(401, done());
  });

  it("should return 200 status code", (done) => {
    request(app)
      .get("/api/users/getAllUsers")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "/json/")
      .expect(200, done());
  });
});

describe("GET USER", () => {
  it("should return 401 status code", (done) => {
    request(app).get("/api/users/getuser").expect(401, done());
  });

  it("should return 200 status code", (done) => {
    request(app)
      .get("/api/users/getuser")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "/json/")
      .expect(200, done());
  });
});
