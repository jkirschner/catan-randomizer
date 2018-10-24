let ncp = require("ncp").ncp;
ncp.limit = 16;
ncp("src/public", ".build/src/public", function(err) {
  if (err) {
    return console.error(err);
  }
  console.log("done!");
});
