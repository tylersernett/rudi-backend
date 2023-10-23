const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const express = require('express');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize')
const { User } = require('../models');
const { usersInDb } = require('./test_helper')

const { DATABASE_URL } = require('../util/config')

const sequelize = new Sequelize(DATABASE_URL, {});
const { connectToDatabase } = require('../util/db')

describe('Users Controller', () => {
  beforeAll(async () => {
    await connectToDatabase()
  });
  beforeEach(async () => {
    try {
      // Clear the 'users' table
      await User.destroy({ where: {} });

      //add 1 default user
      await User.create({
        username: 'root',
        passwordHash: await bcrypt.hash('sekret', 10),
      });

    } catch (error) {
      console.error('Error clearing users table:', error);
    }
  });

  describe('POST /users', () => {
    it('should create a new user when unique username provided', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'testuser',
        password: 'testpassword',
      };

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    });

    it('should return an error for a short password', async () => {
      const user = {
        username: 'testuser',
        password: 'pw',
      };

      const result = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Password too short or missing');
    });

    it('should fail with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'root',
        password: '12345678',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username must be unique')

      const usersAtEnd = await usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
