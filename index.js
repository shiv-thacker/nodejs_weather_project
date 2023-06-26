const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceval = (tempval, orgval) => {
  let temprature = tempval.replace("{%tempval%}", orgval.main.temp);
  temprature = temprature.replace("{%tempmin%}", orgval.main.temp_min);
  temprature = temprature.replace("{%tempmax%}", orgval.main.temp_max);
  temprature = temprature.replace("{%location%}", orgval.name);
  temprature = temprature.replace("{%country%}", orgval.sys.country);
  temprature = temprature.replace("{%tempstatus%}", orgval.weather[0].main);

  return temprature;
};

const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=surat&appid=a76af8dafadea027558ab6f7b48bd48c"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        var array = [objdata];

        const realTimeData = array
          .map((val) => replaceval(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1", (err) => {
  console.log("server listening");
});
