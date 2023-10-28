import request from "supertest";
import { server } from "../src";
import { AppDataSource } from "../src/data-source";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
  await server.close();
});

let token = "";

const expectedCustomers = [
  {
    id: "a4481cee-4851-4287-b2bf-aef2ba09665a",
    companyName: "Test Company",
    country: "DK",
    active: true,
    businessSegment: null,
  },
  {
    id: "a786daee-b8bb-4813-9526-e76b402d67b3",
    companyName: "not the test",
    country: "DK",
    active: true,
    businessSegment: null,
  },
];

const expectedUser = {
  id: "52f20a76-eeec-48ae-a238-d6824aad1721",
  username: "nizar",
  active: true,
  customers: expectedCustomers,
};

describe("basic tests", () => {
  it("responds with json", (done) => {
    request(server)
      .get("/api/v1/users/me")
      .set("Accept", "application/json")
      .expect(401, {}, done);
  });

  // TODO: obviously this could be done a million times better
  it("response with json", (done) => {
    request(server)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .send({
        username: "nizar",
        password: "123",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token; // Save the token
        expect(res.body.token).toBeDefined(); // Check if a token is present
        return done();
      });
  });

  it("should fetch its own details", (done) => {
    request(server)
      .get("/api/v1/users/me")
      .set("Accept", "application/json")
      .auth(token, { type: "bearer" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.user.username).toStrictEqual(expectedUser.username);
        return done();
      });
  });

  it("should link a customer to a user", (done) => {
    request(server)
      .post("/api/v1/customers/link")
      .set("Accept", "application/json")
      .auth(token, { type: "bearer" })
      .send({
        customerId: "a786daee-b8bb-4813-9526-e76b402d67b3",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.customers).toStrictEqual(expectedCustomers);
        return done();
      });
  });

  it("should unlink a customer to a user", (done) => {
    request(server)
      .post("/api/v1/customers/unlink")
      .set("Accept", "application/json")
      .auth(token, { type: "bearer" })
      .send({
        customerId: "a786daee-b8bb-4813-9526-e76b402d67b3",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.customers).toEqual(
          expect.arrayContaining([expectedCustomers[0]])
        );
        return done();
      });
  });
  it("should be able to create a payment", (done) => {
    request(server)
      .post("/api/v1/payments/create")
      .set("Accept", "application/json")
      .auth(token, { type: "bearer" })
      .send({
        thirdParty: "test",
        amount: 100,
        currency: "EUR",
        onBehalfOf: "a4481cee-4851-4287-b2bf-aef2ba09665a",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.amount).toEqual(100);
        return done();
      });
  });

  it("should not be able to create payments with an auth", (done) => {
    request(server)
      .post("/api/v1/payments/create")
      .set("Accept", "application/json")
      .send({
        thirdParty: "test",
        amount: 100,
        currency: "EUR",
        onBehalfOf: "a4481cee-4851-4287-b2bf-aef2ba09665a",
      })
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it("should not be able to make payments on behalf of non-authorized customers", (done) => {
    request(server)
      .post("/api/v1/payments/create")
      .set("Accept", "application/json")
      .auth(token, { type: "bearer" })
      .send({
        thirdParty: "test",
        amount: 100,
        currency: "EUR",
        onBehalfOf: "e0e4bc6a-c04c-46e3-aff9-2df2ee60aab8",
      })
      .expect(500)
      .end((err, _) => {
        if (err) return done(err);
        return done();
      });
  });
});
