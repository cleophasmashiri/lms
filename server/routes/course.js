import express from 'express';
import { requireSignin, isInstructor } from '../middleware';
import { courseImageUpload, courseImageRemove, course, read } from '../controllers/course';

const router = express.Router();

// image
router.post('/course/upload-image', requireSignin, courseImageUpload);
router.post('/course/remove-image', requireSignin, courseImageRemove);

// course
router.post('/course', requireSignin, isInstructor, course);
router.get('/course/:slug', read);

module.exports = router;

