const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const upload = require('express-fileupload')

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const path = require('path')
// const fs = require('fs') //tempory testing

const app = express();
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
// app.use(cors({ credentials: true, origin: "http://localhost:5000" }))
app.use(cors({ credentials: true, origin: ["http://localhost:5173", "http://localhost:3000"] }))
// Temporary debugging for uploads
// const uploadsPath = path.join(__dirname, 'uploads');

// console.log("Uploads directory:", uploadsPath);
// console.log("Uploads directory exists:", fs.existsSync(uploadsPath));

// const imageName = 'snoopy.jpg';

// console.log(
//     "Image exists:",
//     fs.existsSync(path.join(uploadsPath, imageName))
// );

app.use(upload())
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
)

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
    });