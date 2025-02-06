import cloudinary from "../common/cloudinary.js";
import Meme from "../models/meme.js";
import User from "../models/user.js";

export const getMemes = async (req, res) => {
	try {
		const memes = await Meme.find()
			.populate("author")
			.populate("comments")
			.lean();
		res.status(200).json(memes);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createMeme = async (req, res) => {
	const { title } = req.body;
	const user = req.user; // This is the user object that is set in the authentication middleware
	if (!title || !req.file.path || !author) {
		return res.status(400).json({ message: "Required fields are not set" });
	}

	// Checking for duplicates in the database.
	const memeExists = await Meme.findOne({ title, imageUrl }).lean().exec();
	if (memeExists) {
		return res.status(400).json({ message: "Meme already exists" });
	}

	const image = cloudinary.uploader.upload(req.file.path, {
		folder: `memes/${user._id}`,
	});

	const newMeme = await Meme.create({
		title,
		imageUrl: image.secure_url,
		imageId: image.public_id,
		author: user._id,
	});

	await User.updateOne({ _id: user._id }, { $push: { memes: newMeme._id } });

	await newMeme.save();

	if (newMeme) {
		res.status(201).json({ message: "Meme added successfully" });
	} else {
		res.status(400).json({ message: "Failed to add meme" });
	}
};

export const toggleLike = async (req, res) => {
	const { memeId } = req.body;
	const userId = req.user._id;
	if (!memeId || !userId) {
		return res.status(400).json({ message: "Required fields are not set" });
	}

	const meme = await Meme.findById(memeId);
	if (!meme) {
		return res.status(404).json({ message: "Meme not found" });
	}

	const isLiked = meme.likes.includes(userId);
	if (isLiked) {
		meme.likes.pull(userId);
	} else {
		meme.likes.push(userId);
	}

	const updatedMeme = await meme.save();
	if (updatedMeme) {
		res.status(200).json({ message: "Meme liked successfully" });
	} else {
		res.status(400).json({ message: "Failed to like meme" });
	}
};

export const getMemeById = async (req, res) => {
	if (!req.params.memeId) {
		return res.status(400).json({ message: "Meme ID not set" });
	}
	const meme = await Meme.findById(req.memeId)
		.populate("author")
		.populate("comments")
		.lean();
	if (!meme) {
		return res.status(404).json({ message: "Meme not found" });
	}
	return res.status(200).json(meme);
};

export const deleteMeme = async (req, res) => {
	if (!req.memeId) {
		return res.status(400).json({ message: "Meme ID not set" });
	}
	const meme = await Meme.findById(req.memeId);
	if (!meme) {
		return res.status(404).json({ message: "Meme not found" });
	}
	await cloudinary.uploader.destroy(meme.imageId);
	await meme.remove();
	await User.updateOne({ _id: req.user._id }, { $pull: { memes: memeId } });
	return res.status(200).json({ message: "Meme deleted successfully" });
};
