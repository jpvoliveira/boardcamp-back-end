import connection from "../database.js";

export async function getCategories (req,res){
    const result = await connection.query('SELECT * FROM categories');
    res.send(result.rows)
}

export async function postCategories (req,res){
    if (req.body.name.length===0) {
        return res.sendStatus(400)
    }

    const nameTest = await connection.query(
    `SELECT * FROM categories WHERE name='${req.body.name}'`
    );

    if (nameTest.rows[0]) {
        return res.sendStatus(409)
    }

    const categories = await connection.query('SELECT * FROM categories');
    for (let i = 0; i < categories.rows.length; i++) {
        if (categories.rows[i].name === req.body.name) {
            return res.sendStatus(409)
        }
    }
    
    await connection.query(`INSERT INTO categories (name) VALUES ('${req.body.name}')`);
    res.sendStatus(201)
}