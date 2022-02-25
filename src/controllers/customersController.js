import connection from "../database.js";

export async function getCustomers(req, res) {
  if (req.query.cpf) {
    const result = await connection.query("SELECT * FROM customers WHERE cpf LIKE $1",[req.query.cpf + "%"]);
    res.send(result.rows);
  }
  const result = await connection.query("SELECT * FROM customers");
  res.send(result.rows);
}

export async function getIdCustomers(req, res) {
  const result = await connection.query("SELECT * FROM customers WHERE id=$1", [req.params.id]);
  if(!result.rows[0]){
      return res.sendStatus(404)
  }
  res.send(result.rows[0]);
}

export async function postCustomers(req, res){
  //FAZER SCHEMAS
  const {name, phone, cpf, birthday} = req.body
  await connection.query(
  `INSERT INTO customers (name, phone, cpf, birthday) 
    VALUES ( '${name}', '${phone}', '${cpf}', '${birthday}')`)
  res.send(201)
}

export async function putCustomers(req, res){
  //FAZER SCHEMAS
  const {name, phone, cpf, birthday} = req.body
  await connection.query(
      `UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' 
        WHERE id=$1`, [req.params.id])   
  res.sendStatus(200)
}