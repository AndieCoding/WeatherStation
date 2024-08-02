const express = require("express");
const consultaDb = require("../database/consultas");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/registro", async (req, res) => {
	const registeredUser = { ...req.body };
	try {

		const rows = await consultaDb.registry( registeredUser );			
		res.json(rows);

	} catch (err) {

		res.status(401).json({ message: false });
	}
});

router.post("/user", async (req, res) => {
	const loginData = { ...req.body };
	try {
		const [rows] = await consultaDb.login( loginData );
		const result = rows[0];		
		res.json(result);
	} catch (err) {
		res.status(401).json({ message: "Invalid credentials" });
	}
});

router.get("/user", async (req, res) => {
	const user = req.query.username;
	try {

		const [rows] = await consultaDb.login({ user });
		const userData = rows[0];
		console.log('User data retrieved');
		res.json({ userData });

	} catch (err) {
		res.status(404).json({ success: false, message: "User not found" });
	}
});

router.put("/update/:user", async (req,res) => {
	const user = req.params.user;
	const newData = req.body; 	
	
	try {

		const [rows] = await consultaDb.update( user, newData );
		const userData = rows[0];
		res.json({ userData });

	} catch (err) {
		res.status(404).json({ success: false, message: "User not found" });
	}
});

router.delete("/deleteAccount", async (req, res) => {

	const user = req.query.user;

	try {
		
		await consultaDb.deleteUser( user );
		res.json({ success: true, message: "User deleted successfully" }); 

	} catch (err) {    
	  	res.status(404).json({ success: false, message: "User not found" });
	}
});


module.exports = router;