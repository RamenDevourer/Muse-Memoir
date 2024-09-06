import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
});

const blogsSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required : true,
        },
        content: {
            type: String,
            required : true,
        },
        tag: {
            type : String,
            required : true,
        },
        username: {
            type : String,
            required : true,
        },
        views: {
            type : Number,
            required : true,
            default : 0
        },
        viewHistory: [
            {
              timestamp: {
                type: Date,
                default: Date.now,
              }
            }
        ],
        comments: [CommentSchema],
    },
    {
        timestamps : true,
    }
);

export const Blogs = mongoose.model('Blogs', blogsSchema);