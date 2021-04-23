const qs = require('qs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/model/user');
const { JWT_SECRET } = process.env;

const createToken = (user) => {
    const payLoad = {
        username: user.username
    };
    const config = { expiresIn: '1h' };
    return jwt.sign(payLoad, JWT_SECRET, config);
};

const userController = {
    queryUserInfo(req, res) {
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
        const response = {};
        let user = {};
        if (!cookies.token) {
            res.status(200).send({ message: 'Not Login' });
            return;
        }
        const token = JSON.parse(cookies.token);
        if (token) {
            response.success = token.deadline > new Date().getTime();
        }
        if (response.success) {
            User.findOne({ _id: token.id })
                .exec()
                .then((storedUser) => {
                    if (storedUser) {
                        const { password, ...other } = storedUser._doc;
                        user = other;
                        user.permissions = { role: 'admin' };
                        user.avatar = 'https://dummyimage.com/60x60/3c6e91/fff.png&text=VL';
                        response.user = user;
                        console.log(user);
                        res.json(response);
                    }
                })
                .catch((e) =>
                    res.status(500).json({ status: false, message: 'Internal server error.' })
                );
        }
    },
    login(req, res) {
        User.findOne({ username: req.body.username })
            .exec()
            .then((storedUser) => {
                if (storedUser && storedUser.isRegistered) {
                    const userHashPassword = storedUser.password;
                    bcrypt
                        .compare(req.body.password, userHashPassword)
                        .then((matched) => {
                            if (matched) {
                                const token = createToken(storedUser);
                                const now = new Date();
                                now.setDate(now.getDate() + 1);
                                res.cookie(
                                    'token',
                                    JSON.stringify({
                                        id: storedUser._id,
                                        deadline: now.getTime()
                                    }),
                                    {
                                        maxAge: 3600,
                                        httpOnly: true
                                    }
                                );
                                res.status(200).json({
                                    status: true,
                                    message: 'Login Success.',
                                    accessToken: token
                                });
                            } else
                                res.status(401).json({
                                    status: false,
                                    message: 'Auth failed with an incorrect password.'
                                });
                        })
                        .catch((e) =>
                            res
                                .status(500)
                                .json({ status: false, message: 'Internal server error.' })
                        );
                } else {
                    res.status(404).json({
                        status: false,
                        message: 'This user account is not found.'
                    });
                }
            })
            .catch((e) =>
                res.status(500).json({ status: false, message: 'Internal server error.' })
            );
    },
    logout(req, res) {
        res.clearCookie('token');
        res.status(200).end();
    }
};

module.exports = userController;
