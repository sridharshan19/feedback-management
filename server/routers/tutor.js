const express = require('express');
const router = express.Router();
const { getTutors, addTutor, updateTutor, deleteTutor } = require('../controllers/tutorcontroller');

router.get('/gettutors', getTutors);

router.post('/addtutor', addTutor);

router.put('/updatetutor/:tutorId', updateTutor);

router.delete("/deletetutor/:tutorId", deleteTutor);

module.exports = router;
