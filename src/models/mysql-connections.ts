"use strict";
import moment from "moment";
const mysql2 = require("mysql2");
const maxConnectionAge = moment.duration(30, "seconds").asSeconds();
export const Sequelize = require("sequelize");

export let mySQL = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  dialect: "mysql",
  benchmark: true,
  pool: {
    autostart: true,
    max: 10,
    min: 0,
    idle: 1,
    acquire: 25000,
    handleDisconnects: true,
  },
  validate: (obj: any) => {
    if (!obj.createdAt) {
      obj.createdAt = moment();
      return true;
    }
    return moment().diff(obj.createdAt, "seconds") < maxConnectionAge;
  },
  dialectOptions: process.env.USEMYSQLSOCKETCONNECTION
    ? {
        socketPath: process.env.MYSQLSOCKETPATH,
      }
    : {},
  dialectModulePath: "mysql2",
  define: {
    freezeTableName: true,
  },
});
