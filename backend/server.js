const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cofee-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
});

const reviewSchema = new mongoose.Schema({
  username: String,
  email: String,
  review: String,
})

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('review', reviewSchema);

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ ...req.body, password: hashedPassword });

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ $or: [{ email: username }, { username }] });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.status(200).json({ message: "Login successful", user });
});

app.post('/review', async (req, res) => {
  try {
    const username = req.body.name;
    const email = req.body.email;
    const review = req.body.message;

    const newreview = new Review({ username, email, review });
    await newreview.save();  // await saving to ensure completion

    res.status(200).json({ message: "Review saved successfully" });  // send response body
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!!!" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
