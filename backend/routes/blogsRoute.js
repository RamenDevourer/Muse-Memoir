import express from 'express';
import jwt from 'jsonwebtoken';
import {Blogs} from '../models/blogs.js';
import {users} from '../models/users.js';

const router = express.Router();


router.post ('/',authenticateToken , async (req, res) => {
    try {
        if (!req.body.title || !req.body.username || !req.body.content || !req.body.tag){
            return res.status(500).send({message: `send all required fields` })
        }
        const newBlog = {title: req.body.title , username: req.body.username, content: req.body.content, tag: req.body.tag};
        const Blog = await Blogs.create(newBlog);

        return res.status(201).send(Blog);
    } catch (error){
        console.log(error.message);
        return res.status(500).send({message: error.message});
    }
});

router.delete ('/:id',authenticateToken , async (req, res) => {
    try {
        const { id } = req.params;

        const blogs = await Blogs.deleteOne({"_id" : id });

        if (!blogs){
            return res.status(404).json({message : 'Blog not found'});
        }

        return res.status(200).send({message : 'Blog deleted successfully'});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: error.message});
    }
});

router.get('/' ,async (req, res) => {
    try {
        console.log("hi");
        const b = await Blogs.find();
        console.log(b);
        const blogs = await Blogs.find().sort({ "createdAt": -1 }).limit(18);

        return res.status(200).json({
            length : blogs.length,
            data: blogs
        });
    }catch(error) {
        console.log(error.message);
        return res.status(500).send({message : error.message});
    }
});

router.get('/update/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const blogs = await Blogs.find({ "username": username }).sort({ "createdAt": -1 });
        
        return res.status(200).json({
            length : blogs.length,
            data: blogs
        });
    }catch(error) {
        console.log(error.message);
        return res.status(500).send({message : error.message});
    }
});

router.get('/:id',async (req, res) => {
    try {
        const id = req.params.id;
        // const blog = await Blogs.findByIdAndUpdate( {"_id" : id});

        const blog = await Blogs.findByIdAndUpdate(
            id,
            {
              $inc: { views: 1 },
              $push: { viewHistory: { timestamp: Date.now() } }
            },
            { new: true }
          );
        
        console.log(blog.views);
        return res.status(200).json(blog);
    }catch(error) {
        console.log(error.message);
        return res.status(500).send({message : error.message});
    }
});

router.get('/username',async (req, res) => {
    try {
        const { username } = req.body.id;
        const user = await users.findOne( {"_id" : id});

        return res.status(200).json(user);
    }catch(error) {
        console.log(error.message);
        return res.status(500).send({message : error.message});
    }
});

router.get('/analytics/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const blogs = await (Blogs.find({ "username": username }).sort({ "createdAt": -1 }));
        const recent = blogs.slice(0, 5);
        const blogsCount = blogs.length;
        const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
        const totalComments = blogs.reduce((sum, blog) => sum + blog.comments.length, 0);
        const allViewHistory = blogs.reduce((history, blog) => {
            return history.concat(blog.viewHistory);
        }, []);
        
        const modifiedRecentBlogs = recent.map(blog => {
            let title = blog.title;
            if (title.length > 19) {
              title = title.slice(0, 16) + '...';
            }
          
            return {
              id: blog._id,
              title: title
            };
        });
          
        console.log(modifiedRecentBlogs);

        return res.status(200).json({
            length: blogs.length,
            posts: blogsCount,
            views: totalViews,
            comments: totalComments,
            viewHistory: allViewHistory,
            recent: modifiedRecentBlogs,
        });
    }catch(error) {
        console.log(error.message);
        return res.status(500).send({message : error.message});
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;

        const Blog = await Blogs.findByIdAndUpdate(id, req.body, {new: true});

        if (!Blog) {
            return res.status(404).send({message: 'No blog found with the given id'});
        }
        return res.status(200).send(Blog);
    } catch (error){
        console.log(error.message);
        return res.status(500).send({message: error.message});
    }
});

router.put('/movedown/:username/:index', async (req, res) => {
    try {
        const { username, index} = req.params;

        const resultCurrent1 = await Blogs.updateOne({"username": username, "index" : index}, {$set: {"index": -1}});

        if (!resultCurrent1){
            return res.status(404).json({message: 'Current Blog1 not found'});
        }

        const resultNext = await Blogs.updateOne({"username": username, "index" : parseInt(index) + 1}, {$set: {"index": parseInt(index)}});

        if (!resultNext){
            return res.status(404).json({message: 'Next Blog not found'});
        }
        
        const resultCurrent2 = await Blogs.updateOne({"username": username, "index" : -1}, {$set: {"index": parseInt(index) + 1}});

        if (!resultCurrent2){
            return res.status(404).json({message: 'Current Blog2 not found'});
        }

        return res.status(200).send({ message: 'Blog updated successfully '})

    } catch (error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});

router.put('/moveup/:username/:index', async (req, res) => {
    try {
        const { username, index} = req.params;

        const resultCurrent1 = await Blogs.updateOne({"username": username, "index" : index}, {$set: {"index": -1}});

        if (!resultCurrent1){
            return res.status(404).json({message: 'Current Blog1 not found'});
        }

        const resultNext = await Blogs.updateOne({"username": username, "index" : parseInt(index) - 1}, {$set: {"index": parseInt(index)}});

        if (!resultNext){
            return res.status(404).json({message: 'Next Blog not found'});
        }
        
        const resultCurrent2 = await Blogs.updateOne({"username": username, "index" : -1}, {$set: {"index": parseInt(index) - 1}});

        if (!resultCurrent2){
            return res.status(404).json({message: 'Current Blog2 not found'});
        }

        return res.status(200).send({ message: 'Blog updated successfully '})

    } catch (error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});

router.post('/:id/comments', async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, content } = req.body;
  
      const blogPost = await Blogs.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: { title, content }
          }
        },
        { new: true }
      );
  
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.json(blogPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null){
        return res.status(401).send({message: "token not sent"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.status(403).send({message: "Invalid token"});
        }
        req.user = user;
        next();
    })
}

export default router;