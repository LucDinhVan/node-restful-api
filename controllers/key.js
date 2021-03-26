const mongoose = require('mongoose');
const Key = require('../db/model/key');

const keyController = {
    getAllKeys(req, res) {
        Key.find()
            .select('-__v')
            .exec()
            .then((items) => {
                const response = {
                    count: items.length,
                    keys: items.map((item) => {
                        return {
                            _id: item._id,
                            key: item.key,
                            status: item.status,
                            expiredTime: item.expiredTime,
                            request: {
                                type: 'GET',
                                url: `http://${process.env.HOST}:${process.env.PORT}/keys/${item._id}`
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch((e) => res.status(500).json({ error: 'Internal server error.' }));
    },

    getKey(req, res) {
        const { keyID } = req.params;
        Key.findById(keyID)
            .select('-__v')
            .exec()
            .then((item) => {
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.status(404).json({
                        msg: 'No valid entry found.'
                    });
                }
            })
            .catch((e) => res.status(500).json({ error: 'Internal server error.' }));
    },
    createKey(req, res) {
        const key = new Key({
            _id: new mongoose.Types.ObjectId(),
            key: req.body.key,
            status: req.body.status,
            expiredTime: req.body.expiredTime
        });

        key.save()
            .then((item) => {
                res.status(201).json({
                    msg: `New key created.`,
                    createdKey: {
                        _id: item._id,
                        key: item.key,
                        status: item.status,
                        expiredTime: item.expiredTime,
                        request: {
                            type: 'GET',
                            url: `http://${process.env.HOST}:${process.env.PORT}/keys/${item._id}`
                        }
                    }
                });
            })
            .catch((e) => res.status(500).json({ error: 'Internal server error.' }));
    },
    updateKey(req, res) {
        const { keyID } = req.params;
        const updateOps = req.body;
        Key.updateOne({ _id: keyID }, { $set: updateOps })
            .exec()
            .then((result) => {
                if (result.nModified >= 1) {
                    res.status(200).json({
                        msg: 'Key updated successfully.',
                        request: {
                            type: 'GET',
                            url: `http://${process.env.HOST}:${process.env.PORT}/keys/${keyID}`
                        }
                    });
                } else if (result.n === 1) {
                    res.status(404).json({
                        msg: 'No change in key.'
                    });
                } else {
                    res.status(404).json({
                        msg: 'Key not found.'
                    });
                }
            })
            .catch((e) => {
                res.status(500).json({ error: 'Internal server error.' });
            });
    },
    deleteKey(req, res) {
        const { keyID } = req.params;
        Key.deleteOne({ _id: keyID })
            .exec()
            .then((result) => {
                if (result.deletedCount >= 1) {
                    res.status(200).json({
                        msg: 'Key deleted successfully.',
                        request: {
                            type: 'GET',
                            url: `http://${process.env.HOST}:${process.env.PORT}/keys`
                        }
                    });
                } else {
                    res.status(404).json({
                        msg: 'Failed to delete key. Please make sure provide a correct keyID.'
                    });
                }
            })
            .catch((e) => res.status(500).json({ error: 'Internal server error.' }));
    }
};

module.exports = keyController;
