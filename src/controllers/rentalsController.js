import connection from "../database.js";

var date = new Date();
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();

export async function getRentals(req, res) {
  let result = await connection.query(`SELECT * FROM rentals`);

  if (req.query.customerId) {
    result = await connection.query(
      `SELECT * FROM rentals WHERE "customerId"=$1`,
      [req.query.customerId]
    );
  } else if (req.query.gameId) {
    result = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [
      req.query.gameId,
    ]);
  }

  const rentals = [];

  for (let i = 0; i < result.rows.length; i++) {
    rentals.push(result.rows[i]);
    const game = await connection.query(
      `SELECT id, name, "categoryId" FROM games WHERE id=${result.rows[i].gameId}`
    );
    rentals[i].game = game.rows[0];
    const customer = await connection.query(
      `SELECT id, name FROM customers WHERE id=${result.rows[i].customerId}`
    );
    rentals[i].customer = customer.rows[0];
  }

  res.send(rentals);
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const resultId = await connection.query(`SELECT * FROM customers WHERE id=$1`, [
    customerId,
  ]);

  const resultGame = await connection.query(`SELECT * FROM games WHERE id=$1`, [
    gameId,
  ]);

  if (!resultGame.rows[0] || !resultId.rows[0] || daysRented<=0) {
    return res.sendStatus(400)
  }

  const rentDate = `${year}-${month + 1}-${day}`;
  const price = await connection.query(
    `SELECT "pricePerDay" FROM games WHERE id=${gameId}`
  );
  const originalPrice = daysRented * price.rows[0].pricePerDay;

  await connection.query(
    `INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES (${customerId}, ${gameId}, '${rentDate}', ${daysRented}, ${null}, ${originalPrice}, ${null})`
  );

  res.sendStatus(201);
}

export async function postIdRentals(req, res) {
  const resultId = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
    req.params.id,
  ]);

  if (!resultId.rows[0]) {
    return res.sendStatus(404);
  }

  if (resultId.rows[0].returnDate !== null) {
    return res.sendStatus(400);
  }

  await connection.query(
    `UPDATE rentals SET "returnDate"='${`${year}-${month + 1}-${day}`}' 
      WHERE id=${req.params.id}`
  );

  res.sendStatus(200);
}

export async function deleteIdRentals(req, res) {
  const resultId = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
    req.params.id,
  ]);

  if (!resultId.rows[0]) {
    return res.sendStatus(404);
  }

  if (resultId.rows[0].returnDate !== null) {
    return res.sendStatus(400);
  }

  await connection.query(`DELETE FROM rentals WHERE id=$1`, [req.params.id]);
  res.sendStatus(200);
}
