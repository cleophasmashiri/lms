# Write, Delete and Read images to AWS S3
---

```

import aws from 'aws-sdk';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION_KEY,
    apiVersion: process.env.AWS_API_VERSION_KEY,
};

const S3 = new aws.S3(awsConfig);
const BUCKET_NAME = 'terzona-course-4'

export const courseImageUpload = async (req, res) => {
    try {
        // prep image
        const { image } = req.body;
        if (!image) res.status(400).send('No image sent');
        const base64Image = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const type = image.split(';')[0].split('/')[1];
        const imageParams = {
            Bucket: BUCKET_NAME,
            Key: `${nanoid()}.${type}`,
            Body: base64Image,
            ACL: 'public-read',
            ContentEncording: 'base64',
            ContentType: 'image/${type}'
        }
        // upload
        S3.upload(imageParams, (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(data);
            res.send(data);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Error uploading image');
    }
};

export const courseImageRemove = (req, res) => {
    try {
        const { Key, Bucket } = req.body;
        if (!Key) res.status(400).send('No image Key sent');
        S3.deleteObject({ Key, Bucket }, (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(data);
            res.send(data);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Error uploading image');
    }
};

```

<br> <br>

# Send emails with AWS SNS.
---

```

import jwt from 'jsonwebtoken';
import { json } from 'express';
import aws from 'aws-sdk';


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION_KEY,
    apiVersion: process.env.AWS_API_VERSION_KEY,
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

```

