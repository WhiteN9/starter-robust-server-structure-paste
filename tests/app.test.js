const request = require("supertest");
const pastes = require("../src/data/pastes-data");

const path = require("path");
const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

describe("path /pastes", () => {
  // Add tests here
  beforeEach(() => {
    pastes.splice(0, pastes.length); //return an array of no element;
  });

  test("returns an error if the route path does not exist", async () => {
    const response = await request(app).get("/pdasdasd");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.text).toContain("Not found: /pdasdasd");
  });

  describe("GET method", () => {
    it("returns an array of pastes", async () => {
      const expected = [
        {
          id: 1,
          user_id: 1,
          name: "Hello",
          syntax: "None",
          expiration: 10,
          exposure: "private",
          text: "Hello World!",
        },
        {
          id: 2,
          user_id: 1,
          name: "Hello World in Python",
          syntax: "Python",
          expiration: 24,
          exposure: "public",
          text: "print(Hello World!)",
        },
        {
          id: 3,
          user_id: 2,
          name: "String Reverse in JavaScript",
          syntax: "Javascript",
          expiration: 24,
          exposure: "public",
          text: "const stringReverse = str => str.split('').reverse().join('');",
        },
      ];
      pastes.push(...expected);

      const response = await request(app).get("/pastes");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });

    it("returns the correct paste record", async () => {
      const expected = {
        id: 312,
        user_id: 2,
        name: "String Reverse in JavaScript",
        syntax: "Javascript",
        expiration: 24,
        exposure: "public",
        text: "const stringReverse = str => str.split('').reverse().join('');",
      };
      pastes.push(expected);

      const response = await request(app).get("/pastes/312");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });

    test("returns an error if the paste does not exist", async () => {
      const response = await request(app).get("/pastes/99");

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.text).toContain("Paste id not found: 99");
    });
  });

  describe("POST method", () => {
    test("creates a new paste and assigns id", async () => {
      const newPaste = {
        name: "String Reverse in JavaScript",
        syntax: "Javascript",
        expiration: 24,
        exposure: "public",
        text: "const stringReverse = str => str.split('').reverse().join('');",
      };
      const response = await request(app)
        .post("/pastes")
        .set("Accept", "application/json")
        .send({ data: newPaste });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: 5,
        ...newPaste,
      });
    });
  });

  it("return 400 if result is missing", async () => {
    const response = await request(app)
      .post("/pastes")
      .set("Accept", "application/json")
      .send({ data: { message: "return 400 if result is missing" } });

    expect(response.status).toBe(400);
  });

  it("return 400 if result is empty", async () => {
    const response = await request(app)
      .post("/pastes")
      .send("Accept", "application/json")
      .send({ data: { result: "" } });

    expect(response.status).toBe(400);
  });
  afterEach(() => {});
});
