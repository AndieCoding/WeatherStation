const db = require("./db");

async function registry(data) {
    let conn = await db.getConn();
    try {
        let name = data.name;
        let correo = data.email;
        let pais = data.country;
        let localidad = data.city;
        let user = data.user;
        let pass = data.pass;

        const [existentName] = await conn.query(
            `SELECT * FROM users WHERE name =?`,
            [name]
        );

        if (existentName.length > 0) {
            console.log('Nombre existente');          
            return { message: "No puede tener más de una cuenta a su nombre", success: false };
        }

        const [existentUser] = await conn.query(
            `SELECT * FROM users WHERE user =?`,
            [user]
        )
        if (existentUser.length > 0) {      
            console.log('Usuario existente');      
            return { message: "El usuario ya existe", success: false };
        }

        const [existentEmail] = await conn.query(
            `SELECT * FROM users WHERE email =?`,
            [correo]
        )

        if (existentEmail.length > 0) {       
            console.log('Email existente');     
            return { message: "El email ya existe", success: false };
        }

        const [result] = await conn.query(
            `INSERT INTO users(name, email, country, city, user, pass)
			VALUES (?, ?, ?, ?, ?, ?);`,
            [name, correo, pais, localidad, user, pass]
        );

        console.log('Registro exitoso');
        return { message: "Usuario registrado", success: true };
    } catch (err) {
        console.log("Error registering", err);
    } finally {
        conn.release();
    }
}

async function login(credentials) {
    let conn = await db.getConn();
    try {
        if (!credentials.pass) {

            const [user] = await conn.query(
                `SELECT * FROM users WHERE user = ?`,
                [credentials.user]
            );
            return user;

        } else {

            const [data] = await conn.query(
                `SELECT * FROM users WHERE user = ? AND pass = ?`,
                [credentials.user, credentials.pass]
            );

            if (data.length > 0) {               

                console.log('Logged successfull \n');
                return [data];

            } else {
                
                console.log('Denied \n');
                return;

            }
        }        
        return;

    } catch (err) {
        console.log("Credentials error", err);

    } finally {
        conn.release();
    }
}

async function update(user, data) {
    let conn = await db.getConn();
    try {
        
        const option = Object.keys(data)[0];
        const value = data[option];        
        await conn.query(
            `UPDATE users SET ${option} = ? WHERE user = ?`, [
            value, user
        ]);

        console.log(`${option} updated`);

        if (option === 'user') { 
                const [newUser] = await conn.query(
                    `SELECT * FROM users WHERE user = ?`,
                    [ value ]
                );
                return [newUser];
        }
        const [updatedData] = await conn.query(
            `SELECT * FROM users WHERE user = ?`,
            [ user ]
        );
        return [updatedData];
    } catch (err) {
        console.log("Update error", err);
    } finally {
        conn.release();
    }
}

async function deleteUser(user) {
    let conn = await db.getConn();
    try {
        await conn.query(
            `DELETE FROM users WHERE user = ?;`,
            [user]
        );
        console.log("User deleted successfully \n");
    } catch (err) {
        console.log("Delete error", err);
    } finally {
        conn.release();
    }        
}

module.exports = {
    registry,
    login,
	update,
    deleteUser
};
