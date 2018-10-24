import { mySQL, Sequelize } from "./mysql-connections";

mySQL.define(
  "Demo",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    demo: Sequelize.STRING,
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

export const Demo = mySQL.models.Users;
