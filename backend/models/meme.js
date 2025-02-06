import mongoose from "mongoose";

const memeSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		imageId: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				type: String,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true },
);

const Meme = mongoose.model("Meme", memeSchema);

export default Meme;