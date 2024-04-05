import request from "supertest";
import app from "../src/index";

describe("User Endpoints", () => {
  let token: string;

  beforeAll(() => {
    return request(app)
      .post("/api/login")
      .send({ email: "admin@example.com", password: "adminpassword" })
      .then((response) => {
        token = response.body.token;
      });
  });

  it("should fetch a specific user by ID", async () => {
    const response = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
  });

  it("should update user details", async () => {
    const response = await request(app)
      .put("/api/users/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@gmail.com',
        role: 'admin'
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.firstName).toBe("Jane");
    expect(response.body.user.lastName).toBe("Doe");
    expect(response.body.user.email).toBe("jane.doe@gmail.com");
    expect(response.body.user.role).toBe("admin");
  });

  it("should delete a user by ID", async () => {
    const response = await request(app)
      .delete("/api/users/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });
});
