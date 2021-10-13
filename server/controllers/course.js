import aws from 'aws-sdk';
import { nanoid } from 'nanoid';
import Course from '../models/course';
import slugify from 'slugify';

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

export const course = async (req, res) => {
    try {
        const { name } = req.body;
        const alredyExists = await Course.findOne({ slug: slugify(name.toLowerCase())});
        if (alredyExists) {
            res.status(400).send('Course with same name already exists');
        }
        const course = await new Course({
            ...req.body,
            slug: slugify(name),
            instructor: req.user._id,
        }).save();
        res.json(course);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Error creating course');
    }
};

export const read = async (req, res) => {
    try {
        const {slug} = req.params;
        const course = await Course.findOne({slug})
        .populate('instructor', '_id, name')
        .exec();
        res.json(course);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Error creating course');
    }
};