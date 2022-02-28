import connection from "../database.js";

export async function getGames(req, res) {
  if (req.query.name) {
    const result = await connection.query(`SELECT * FROM games WHERE name LIKE $1`,[req.query.name+'%']);
    res.send(result.rows);
  }else{
    const result = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories
        ON games."categoryId"=categories.id`);
    res.send(result.rows);
  }
}

export async function postGames(req, res) {
  const {name, image, stockTotal, categoryId, pricePerDay} = req.body

  if (name.length === 0 || parseFloat(stockTotal) === 0 || parseFloat(pricePerDay) === 0) {
    return res.sendStatus(400)
  }

  const nameTest = await connection.query(
    `SELECT * FROM games WHERE name='${name}'`
  );

  if (nameTest.rows[0]) {
    return res.sendStatus(409)
  }

  const idTest = await connection.query(
    `SELECT * FROM categories WHERE id='${categoryId}'`
  );

  if (!idTest.rows[0]) {
    return res.sendStatus(409)
  }

  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES ('${name}','${image}',${parseFloat(stockTotal)},${categoryId},${parseFloat(pricePerDay)})`
  );

  res.sendStatus(201);
}
