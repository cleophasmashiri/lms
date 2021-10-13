import User from '../models/user';
import queryString from 'query-string';
import Course from '../models/course';

const stripe = require('stripe')(process.env.STRIPE_SECREAT_KEY);
export const instructor = async (req, res) => {
    try {
        // 1 find user
        console.log('userid', req.body);
        const user = await User.findById(req.body.userId).exec();
        // 2 if user no stripe_account_id create new 
        if (!user.stripe_account_id) {
            const account = await stripe.accounts.create({
                type: 'express',
            });
            user.stripe_account_id = account.id;
            user.save();
        }
        // 3 create account link based on account, id used on UI
        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: 'account_onboarding'
        });
        // 4 Prefill infor such as email in UI
        accountLink = Object.assign(accountLink, {
            'stripe_user[email]': user.email
        });
        // 5 Send link json to UI
        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    } catch (err) {
        console.log(err);
        res.status(400).send('Stripe error');
    }
};


export const accountStatus = async (req, res) => {
    try {

        const user = await User.findById(req.body._id);
        const account = stripe.accounts.retrieve(use.stripe_account_id);
        if (!account.charges_enabled) {
            return res.status(401).send('Unauthorised');
        } else {
            const statusUpdated = await User.findByIdAndUpdate(user._id, {
                stripe_seller: account,
                $AddToSet: { role: 'Instructor' },
            },
                { new: true })
                .select('-password')
                .exec();
            res.json(statusUpdated);
        }


    } catch (err) {
        console.log(err);
        res.status(400).send('');
    }
};

export const currentInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec();
        if (!user.role.includes('Instructor'))
            return res.status(403).send('Not authorised');
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('Get instructor error');
    }
};

export const instructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
        .sort({createdAt: -1})
        .exec();
        res.json(courses)
    } catch (error) {
        console.log(error);
        res.status(400).send('Error getting courses');
    }
};