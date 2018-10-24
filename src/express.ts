import mimeHelper from "./util/mimes";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import express from "express";
import es from "aws-serverless-express";
import * as path from "path";

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(r, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

const server = es.createServer(app, null, mimeHelper.typesArray);

module.exports.handler = (event, context) => es.proxy(server, event, context);
