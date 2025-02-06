import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
	try {
		const user_id = req.headers.user_id;
		const user = await User.findById(user_id);
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		// req.user is used to store the user object for later use.
		req.user = user;
		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
