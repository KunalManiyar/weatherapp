const http = require("http");
const fs = require("fs");
const requests = require("requests");
const htmlContent = fs.readFileSync("main.html", "utf-8");
const updateVal = (api,main) => {
    let temperature = main.replace("{%temp%}",api.main.temp);
    temperature = temperature.replace("{%mintemp%}",api.main.temp_min);
    temperature = temperature.replace("{%maxtemp%}",api.main.temp_max);
    temperature = temperature.replace("{%city%}",api.name);
    temperature = temperature.replace("{%code%}", api.sys.country);
    temperature = temperature.replace("{%tempStatus%}",api.weather[0].main)
    return temperature;
};
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=29cbd36874c4ae69407374e300680059')
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData=[objData]
                // console.log(arrData);
                const htmlData = arrData.map((val) => updateVal(val, htmlContent)).join("");
                // console.log(htmlData);
                res.write(htmlData);
            })
            .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});
server.listen(8000, "127.0.0.1");