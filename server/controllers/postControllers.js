const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')


// create a Post
// POST : api/posts
// Protected
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }

        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail too big. File should be less than 2mb."))
        }
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.id })
                if (!newPost) {
                    return next(new HttpError("Post couldn't be created", 422))
                }
                //find user and increate post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(201).json(newPost)

            }
        })
    } catch (error) {
        console.error(error);
        return next(new HttpError(error))
    }
}

// get all post
// GET : api/posts
// Protected
const getPosts = async (req, res, next) => {
    try {
        // const posts = await Post.find().populate('creator', 'name avatar').sort({ updatedAt: -1 })
        const posts = await Post.find().populate('creator', 'name avatar').sort({ createdAt: -1 })

        res.status(200).json(posts)

    } catch (error) {
        console.error("Get all posts Error:", error);
        return next(new HttpError(error))
    }
}

// get a post
// GET : api/posts/:id
// UNProtected (read a post)
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('creator', 'name avatar')
        if (!post) {
            return next(new HttpError("Post not found", 404))
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Get single post Error:", error);
        return next(new HttpError(error))
    }
}

// get posts by category
// GET : api/posts/categories/:category
// UNProtected
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).populate('creator', 'name avatar').sort({ createdAt: -1 })
        res.status(200).json(catPosts);
    } catch (error) {
        console.error("Posts by category Error:", error);
        return next(new HttpError(error))
    }
}

// get authors post
// GET : api/posts/users/:id
// UNProtected
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).populate('creator', 'name avatar').sort({ createdAt: -1 })
        res.status(200).json(posts);
    } catch (error) {
        console.error("Get user post Error:", error);
        return next(new HttpError(error))
    }
}

// edit post
// PATCH : api/posts/:id
// Protected
const editPost = async (req, res, next) => {
    try {
        let fileName, newFilename, updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;
        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422))
        }
        // get old post from db
        const oldPost = await Post.findById(postId)
        if (!oldPost) {
            return next(new HttpError("Post not found", 404));
        }
        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError("You are not authorized to edit this post.", 403))
        }
        if (req.user.id == oldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
            } else {
                // delete old thumbnail
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })
                //upload new thumbnail
                const { thumbnail } = req.files;
                //check file size
                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail too big. File should be less than 2mb."))
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true })
            }
        }
        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        console.error("Edit post Error:", error);
        return next(new HttpError(error))
    }
}

// delete posts
// DELETE : api/posts/:id
// Protected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post unavailable.", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {

            // delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId)
                    //find user and reduce post count by 1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                    res.json(`Post ${postId} deleted successfully.`)

                }
            })
        } else {
            return next(new HttpError("Post couldn't be deleted.", 403))
        }
    } catch (error) {
        console.error("Delete post Error:", error);
        return next(new HttpError(error))
    }
}

module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };