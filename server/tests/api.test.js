const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app"); // Your Express app instance

const { expect } = chai;
chai.use(chaiHttp);

describe("API Tests", () => {
  it("should return the API message", async () => {
    const res = await chai.request(app).get("/api");
    expect(res).to.have.status(200);
    expect(res.text).to.equal("<h1>Welcome to Real-time Chat-App</h1>");
  });

  it("should GET chat messages", async () => {
    const res = await chai.request(app).get("/api/messages");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should POST chat message", async () => {
    const res = await chai
      .request(app)
      .post("/api/messages")
      .send({ sender: "Guest", content: "Hi there!", timestamp: Date.now() });
    expect(res).to.have.status(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.message).to.equal("Message sent successfully.");
  });
});

describe("Rate Limiting Functionality", () => {
  it("should return a rate limit exceeded message", async () => {
    // Send more than 15 messages
    let res;
    for (let i = 0; i < 16; i++) {
      res = await chai
        .request(app)
        .post("/api/messages")
        .send({
          sender: "Guest",
          content: `Message ${i}`,
        });
    }
    expect(res).to.have.status(429);
    expect(res.body.error).to.equal("Rate limit exceeded. Try again later.");
  });

  it("should allow sending messages after the rate limit is over", () => {
    setTimeout(() => {
      const res = chai.request(app).post("/api/messages").send({
        sender: "Guest",
        content: `Hello, Again!`,
        timestamp: Date.now(),
      });
      expect(res).to.have.status(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal("Message sent successfully.");
    }, 30000);
  });
});
