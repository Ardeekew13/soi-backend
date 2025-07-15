const bcrypt = require("bcrypt");

const password = "nEDar!Hp"; // replace with your plain text password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
	if (err) {
		console.error("Error hashing password:", err);
		return;
	}
	console.log("Hashed Password:", hash);
});
