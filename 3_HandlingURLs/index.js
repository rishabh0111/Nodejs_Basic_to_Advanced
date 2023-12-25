const http = require("http");
const fs = require("fs");
const url = require("url");

const myServer = http.createServer((req, res) => {
    if(req.url === "/favicon.ico") return res.end();
    const log = `${Date.now()}: ${req.method} ${req.url} New Req Received \n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);
    fs.appendFile("log.txt", log, (err, data) => {
        switch(myUrl.pathname) {
            case '/': 
                if(req.method === "GET") res.end("HomePage");
            break
            case '/about':
                const username = myUrl.query.my_name;    
                res.end(`Hi, ${username}`) 
            break
            case '/search':
                const search = myUrl.query.search_query;
                res.end("Here are your results for " + search);
            break
            case '/signup':
                if(req.method === 'GET') res.end("This is a signup Form");
                else if (req.method === "POST") {
                    // DB Query
                    res.end("Singup");
                }
            default: res.end("404 Not found");
        }
    })
});

myServer.listen(8000, () => console.log("Server Started"));
