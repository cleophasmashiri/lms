import User from '../models/user';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
import { json } from 'express';
import aws from 'aws-sdk';
import { nanoid } from 'nanoid';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION_KEY,
    apiVersion: process.env.AWS_API_VERSION_KEY,
};

const SES = new aws.SES(awsConfig);

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) return res.status(400).send('Name is required');
        if (!password || password.length < 6) return res.status(400).send('Password is required and must be at least 6 characters');
        if (!email) return res.status(400).send('Email is required');
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send('Email exists already');
        }
        // hash pass
        const hashedPassword = await hashPassword(password);
        // register
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        console.table(hashedPassword);
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error try again');
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'Signout successful' });

    } catch (err) {
        res.status(400).send('Error');
    }
};

export const login = async (req, res) => {
    try {
        // validate email and pass
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password required');
        }
        // find user
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(400).send('Email or password error');
        }
        // validate pass
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send('Invalid Email or Password');
        }
        // gen token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = undefined;
        // send token and cookie
        res.cookie('token', token, {
            httpOnly: true
        });

        res.json(user);
    } catch (err) {
        console.log('Error: ', err);
        return res.status(400).send('Error, try again');
    }

};

export const currentUser = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password').exec();
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
};

export const sendEmail = async (req, res) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [process.env.EMAIL_FROM]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data:
                        `
                    <html>
                        <h1>Reset password link</h1>
                        <p>Please use the following link to reset password</p>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "Password Reset link"
            }
        }
    };
    SES.sendEmail(params).promise()
        .then(result => {
            res.json({ ok: true });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('Error sending email');
        });
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const passwordResetCode = nanoid(6);
        const user = await User.findOneAndUpdate({ email }, { passwordResetCode });
        if (!user) return res.status(400).send('User not found');
        // email
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [process.env.EMAIL_FROM]
            },
            ReplyToAddresses: [process.env.EMAIL_FROM],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data:
                            `
                        <html>
                            <h1>Reset password</h1>
                            <p>Please use the following code: ${passwordResetCode} to reset password</p>
                        </html>
                        `
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: "Password Reset code"
                }
            }
        };
        SES.sendEmail(params).promise()
            .then(result => {
                res.json({ ok: true });
            })
            .catch(err => {
                console.log(err);
                res.status(400).send('Error sending email');
            });

    } catch (err) {
        console.log(err);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword} = req.body;
        console.log(code);
        const passwordHash = await hashPassword(newPassword);
        const user = await User.findOneAndUpdate({ email, passwordResetCode: code }, { passwordResetCode: "", password: passwordHash }).exec();
        console.log(user);
        if (!user) res.status(400).send('Error: code not found');
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(400).send('Reset password error');
    }
};