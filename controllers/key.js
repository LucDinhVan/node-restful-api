const mongoose = require('mongoose');
const Key = require('../db/model/key');

const keyController = {
    getAllKeys1(req, res) {
        Key.find()
            .select('-__v')
            .exec()
            .then((items) => {
                const response = {
                    total: items.length,
                    data: items.map((item) => {
                        return {
                            id: item._id,
                            createTime: item.createTime,
                            name: item.name,
                            phone: item.phone,
                            key: item.key,
                            status: item.status,
                            expiredTime: item.expiredTime
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch((e) =>
                res.status(500).json({ success: false, error: 'Internal server error.' })
            );
    },

    getAllKeys(req, res) {
        const { query } = req;
        let { pageSize, page, ...other } = query;
        pageSize = pageSize || 10;
        page = page || 1;
        let queryBuilder = {};
        if (other.name) {
            queryBuilder = { name: other.name };
        }
        if (other.createTime) {
            queryBuilder = { createTime: { $gte: other.createTime[0], $lte: other.createTime[1] } };
        }
        console.log(queryBuilder);
        Key.find(queryBuilder)
            .select('-__v')
            .exec()
            .then((items) => {
                res.status(200).json({
                    data: items
                        .map((item) => {
                            return {
                                id: item._id,
                                createTime: item.createTime,
                                name: item.name,
                                phone: item.phone,
                                key: item.key,
                                status: item.status,
                                expiredTime: item.expiredTime
                            };
                        })
                        .slice((page - 1) * pageSize, page * pageSize),
                    total: items.length
                });
            })
            .catch((e) => {
                console.log(e);
                res.status(500).json({ success: false, error: 'Internal server error.' });
            });
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
                        success: false,
                        message: 'No valid entry found.'
                    });
                }
            })
            .catch((e) =>
                res.status(500).json({ success: false, error: 'Internal server error.' })
            );
    },
    createKey(req, res) {
        const key = new Key({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone: req.body.phone,
            key: req.body.key,
            status: req.body.status,
            expiredTime: req.body.expiredTime
        });

        key.save()
            .then((item) => {
                res.status(201).json({
                    success: true,
                    message: `New key created.`,
                    createdKey: {
                        id: item._id,
                        name: item.name,
                        phone: item.phone,
                        key: item.key,
                        status: item.status,
                        expiredTime: item.expiredTime
                    }
                });
            })
            .catch((e) =>
                res.status(500).json({ success: false, error: 'Internal server error.' })
            );
    },
    updateKey(req, res) {
        const { keyID } = req.params;
        const updateOps = req.body;
        Key.updateOne({ _id: keyID }, { $set: updateOps })
            .exec()
            .then((result) => {
                if (result.nModified >= 1) {
                    res.status(200).json({
                        success: true,
                        message: 'Key updated successfully.'
                    });
                } else if (result.n === 1) {
                    res.status(404).json({
                        success: false,
                        message: 'No change in key.'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Key not found.'
                    });
                }
            })
            .catch((e) => {
                res.status(500).json({ success: false, error: 'Internal server error.' });
            });
    },
    deleteKey(req, res) {
        const { keyID } = req.params;
        Key.deleteOne({ _id: keyID })
            .exec()
            .then((result) => {
                if (result.deletedCount >= 1) {
                    res.status(200).json({
                        success: true,
                        message: 'Key deleted successfully.'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Failed to delete key. Please make sure provide a correct keyID.'
                    });
                }
            })
            .catch((e) =>
                res.status(500).json({
                    success: false,
                    error: 'Internal server error.'
                })
            );
    }
};

module.exports = keyController;
