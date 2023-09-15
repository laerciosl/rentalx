import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import connectDB from "@shared/infra/typeorm";

// let connection: DataSource;

describe("List Category Controller", () => {
  const path = "/categories";

  beforeAll(async () => {
    await connectDB.initialize();
    await connectDB.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connectDB.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXXXXXX' )`,
    );
  });

  afterAll(async () => {
    await connectDB.dropDatabase();
    await connectDB.destroy();
  });
  it("Should be able to list all categories", async () => {
    const responseToken = await request(app).post("/authenticate").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post(`${path}`)
      .send({
        name: "Category Supertest",
        description: "Categoria de carros Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`${path}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
  });
});
