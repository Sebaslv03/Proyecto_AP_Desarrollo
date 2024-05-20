const express = require('express');
const router = express.Router();
//const User = require('../Models/User');

router.get('/user', (req, res) => {
    res.send('Hello User');
});
/** get User by Id using model User by mongoose */
router.get('/user/:id', (req, res) => {
    // User.findById(req.params.id, (err, user) => {
    //     if (err) {
    //         res.status
    //     }
    //     res.status(200).json(user);
    // });
    res.send('Hello User '+req.params.id);
});

/** create User by model User mongoose */
router.post('/user', (req, res) => {
    // User.create(req.body, (err, user) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(201).json(user);
    // });
    res.send('Hello User');
});

/** Update User by model User mongoose */
router.put('/user/:id', (req, res) => {
    // User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(200).json(user);
    // });
    res.send('Hello User '+req.params.id);
});


module.exports = router;
