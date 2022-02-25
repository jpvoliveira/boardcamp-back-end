import connection from "../database.js";

export async function getGames(req, res) {
  if (req.query.name) {
    const result = await connection.query(`SELECT * FROM games WHERE name LIKE $1`,[req.query.name+'%']);
    res.send(result.rows);
  }else{
    const result = await connection.query("SELECT * FROM games");
    res.send(result.rows);
  }
}

export async function postGames(req, res) {
  if (req.body.name.length === 0 || parseFloat(req.body.stockTotal) === 0 || parseFloat(req.body.pricePerDay) === 0) {
    return res.sendStatus(400)
  }

  const nameTest = await connection.query(
    `SELECT * FROM games WHERE name='${req.body.name}'`
  );

  if (nameTest.rows[0]) {
    return res.sendStatus(409)
  }

  const idTest = await connection.query(
    `SELECT * FROM categories WHERE id='${req.body.categoryId}'`
  );

  if (!idTest.rows[0]) {
    return res.sendStatus(409)
  }

  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES ('${req.body.name}','${req.body.image}',${parseFloat(req.body.stockTotal)},${req.body.categoryId},${parseFloat(req.body.pricePerDay)})`
  );

  res.sendStatus(201);
}
