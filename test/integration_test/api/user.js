const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const client = request(app);

describe('API - /user', function () {
    const signupInfo = {
        email: 'test@mail-xxxx-server.com',
        password: 'test'
    };
    const incorrectPasswordLogin = { email: 'test@mail-xxxx-server.com', password: 'wrong' };
    const notExistEmailLogin = { email: 'test@not-exist-mail-xxxx-server.com', password: 'test' };
    after(async function () {
        await mongoose.connection.db.dropCollection('users');
    });
    describe('POST /login', function () {
        it('should login successfully if correct email and password provided', function (done) {
            client
                .post('/user/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(signupInfo)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    expect(res.body).to.has.property('msg');
                    expect(res.body).to.has.property('accessToken');
                    done();
                });
        });
        it('should return 401 Auth failed if incorrect password provided', function (done) {
            client
                .post('/user/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(incorrectPasswordLogin)
                .expect(401, done);
        });
        it('should return 404 not found error if email is not exist', function (done) {
            client
                .post('/user/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(notExistEmailLogin)
                .expect(404, done);
        });
    });
});
