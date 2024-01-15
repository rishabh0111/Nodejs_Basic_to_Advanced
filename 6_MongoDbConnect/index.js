const express = require('express');
const fs = require('fs');
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
app.use(express.urlencoded({ extended: false}));

mongoose
    .connect('mongodb+srv://admin:admin@cluster0.en1paje.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log('Mongo Err', err));

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
    },
        {timestamps: true}
    );

const User = mongoose.model('user', userSchema);


app.get('/users', async(req, res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
        ${allDbUsers.map(user => `<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

// REST API
app.get('/api/users', async (req, res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
})

app.route('/api/users/:id')
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({error: "user not found"});
        return res.json(user);
    })
    .patch(async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) return res.status(404).json({ status: 'failure', message: 'User not found' });
            return res.json({ status: 'success', message: 'User updated successfully' });
        } catch (error) {
            return res.status(500).json({ status: 'failure', message: 'Internal server error' });
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ status: 'failure', message: 'User not found' });
            return res.json({ status: 'success', message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ status: 'failure', message: 'Internal server error' });
        }
    })

app.post('/api/users', async (req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json({msg: 'All fields are required'})
    }

    await User.create({
        first_name: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });

    return res.status(201).json({msg: "success"});
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))