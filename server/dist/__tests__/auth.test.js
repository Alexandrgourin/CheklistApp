"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const User_1 = require("../models/User");
const config_1 = require("../config");
describe('Authentication Tests', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(config_1.config.mongoUri);
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    beforeEach(async () => {
        await User_1.User.deleteMany({});
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.name).toBe('Test User');
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });
        it('should not register user with existing email', async () => {
            // First registration
            await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            // Second registration with same email
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password456'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Email already exists');
        });
        it('should validate email format', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid email format');
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });
        it('should login with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('test@example.com');
        });
        it('should not login with incorrect password', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
        it('should not login with non-existent email', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
    });
    describe('GET /api/auth/me', () => {
        let token;
        beforeEach(async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            token = response.body.token;
        });
        it('should get current user profile', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@example.com');
            expect(response.body.name).toBe('Test User');
        });
        it('should not get profile without token', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'No authentication token provided');
        });
        it('should not get profile with invalid token', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid token');
        });
    });
});
