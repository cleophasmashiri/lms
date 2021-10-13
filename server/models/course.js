import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 320,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    content: {
        type: {},
        minlength: 200,
    },
    video_link: {},
    free_preview: {
        type: Boolean,
        default: false,
    },
}
    , { timestamps: true }
);

const courseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 320,
    },
    category: {
        type: String,
        maxlength: 320,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: {},
        minlength: 200,
        required: true,
    },
    price: {
        type: Number,
       default: 9.99
    },
    video_link: {},
    image: {
    },
    category: {
        type: String
    },
    published: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: true
    },
    instructor: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    lessons: [lessonSchema]

}
    , { timestamps: true }
);

export default mongoose.model("Course", courseSchema);