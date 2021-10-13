# Write, Delete and Read images to AWS S3


To run app: 
1. Create client/.env.local as:

```
NEXT_PUBLIC_API=http://localhost:8000/api/
NEXT_PUBLIC_STRIPE_KEY=[STRIPE_KEY To test stipe payment integration]

```

2. Create server/.env as:

```
PORT=8000
DATABASE=[YOUR Mongodb url]
JWT_SECRET=[Your own JWT_SECRET]
AWS_ACCESS_KEY_ID=[your own AWS_ACCESS_KEY_ID]
AWS_SECRET_KEY=[your own AWS_SECRET_KEY]
AWS_REGION_KEY='[your own AWS_REGION_KEY]'
AWS_API_VERSION_KEY='[your own AWS_API_VERSION_KEY]'
EMAIL_FROM=[your own EMAIL_FROM]
STRIPE_SECREAT_KEY=[your own STRIPE_SECREAT_KEY]
STRIPE_REDIRECT_URL=http://localhost:3000/stipe/callback

```

3 Run:

```
cd server
npm start

# in second terminal window

cd client 
npm run dev
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

# Send emails with AWS SES.

```

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

