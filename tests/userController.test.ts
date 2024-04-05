// userController.test.ts

import request from 'supertest';
import app from '../src/index'; 

describe('User Controller', () => {
  it('should register/create a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'admin'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.firstName).toBe("John");
    expect(response.body.user.lastName).toBe("Doe");
    expect(response.body.user.email).toBe("john@example.com");
    expect(response.body.user.password).toBe("password");
    expect(response.body.user.role).toBe("admin");
  });

  it('should get a user by ID', async () => {
    const response = await request(app).get('/api/users/1');
    
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.firstName).toBe("John");
    expect(response.body.user.lastName).toBe("Doe");
  });

  it('should update a user', async () => {
    const response = await request(app)
      .put('/api/users/1')
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

  it('should delete a user', async () => {
    const response = await request(app).delete('/api/users/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });
  
});
