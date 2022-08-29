import mysql from "mysql2";
export const con = mysql.createPool({
  connectionLimit: 10,
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASSWORD,
  database: "main",
});

con.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
      console.log(err);
    }
  }
  if (connection) connection.release();

  return;
});
