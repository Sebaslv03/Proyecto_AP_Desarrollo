const express = require('express');
const router = express.Router();
//const Movie = require('../Models/Movie');

/** get movie by id using model Movie mongoose*/
router.get('/movie/:id', (req, res) => {
    // Movie.findById(req.params.id, (err, movie) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(200).json(movie);
    // });
    res.send('Hello Movie '+req.params.id);
});

/** get top n movies using model Movie mongoose */
router.get('/movie/top/:n', (req, res) => {
    // Movie.find().limit(parseInt(req.params.n)).exec((err, movies) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(200).json(movies);
    // });
    res.send('Hello Movie '+req.params.n);
});

/** create movie by model Movie mongoose */
router.post('/movie', (req, res) => {
    // Movie.create(req.body, (err, movie) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(201).json(movie);
    // });
    res.send('Hello Movie');
});

/** Update movie by model Movie mongoose */
router.put('/movie/:id', (req, res) => {
    // Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, movie) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     res.status(200).json(movie);
    // });
    res.send('Hello Movie '+req.params.id);
});