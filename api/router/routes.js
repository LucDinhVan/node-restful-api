const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/checkAuth');

function getRoutes(req, res) {
    res.status(200).json([
        {
            id: '1',
            icon: 'dashboard',
            name: 'Dashboard',
            vi: { name: 'Bảng điều khiển' },
            route: '/dashboard'
        },
        {
            id: '2',
            breadcrumbParentId: '1',
            name: 'Keys',
            vi: { name: 'Quản lý key' },
            icon: 'user',
            route: '/user'
        },
        {
            id: '21',
            menuParentId: '-1',
            breadcrumbParentId: '2',
            name: 'User Detail',
            vi: { name: 'Chi tiết' },
            route: '/user/:id'
        }
    ]);
}

router.get('/', checkAuth, getRoutes);

module.exports = router;
