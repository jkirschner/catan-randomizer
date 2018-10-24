import Global = NodeJS.Global;
import { mySQL } from "./models/mysql-connections";

interface CDTGlobal extends Global {
  fetch: any;
}

declare let global: CDTGlobal;
global.fetch = require("node-fetch");

export async function handler(ev: any, ctx: any, callback: any) {
  console.log(JSON.stringify(ev));
  ctx.callbackWaitsForEmptyEventLoop = false;
  const { field, context } = ev;
  console.log("handler");
  const success = (data: any, comment: any = undefined) => callback(comment, data);
  try {
    await mySQL.authenticate();
    switch (field) {
      default:
        success({});
        break;
    }
    return;
  } catch (error) {
    console.log(error);
    return success({});
  }
}
