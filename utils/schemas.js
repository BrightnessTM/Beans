const { Schema, model } = require("mongoose");
// IMPORTANT: Snowflakes MUST be Strings, not Numbers

const bean = new Schema({
	name: { type: String, required: true },
	color: { type: String, required: true },
	emoji: { type: String, required: true },
	message: { type: String, required: true },
	image: String
});

const user = new Schema({
	id: { type: String, required: true }, // user id
	blocked: { type: Boolean, default: false },
	beans: {
		sent: [{
			beantype: String,
			count: Number
		}],
		received: [{
			beantype: String,
			count: Number
		}]
	}
});

module.exports = {
	User: model("user", user, "users"),
	Bean: model("beans", bean, "beans")
};
