import express from 'express';
import { requireSignin } from '../middleware';
import { accountStatus, instructor , currentInstructor, instructorCourses} from '../controllers/instructor';

const router = express.Router();
router.post('/make-instructor', instructor);
router.post('/account-status', accountStatus);
router.get('/current-instructor',requireSignin, currentInstructor);
router.get('/instructor-courses', requireSignin, instructorCourses);

module.exports = router;