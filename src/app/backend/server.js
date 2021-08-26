const http = require('http');
const server = http.createServer();
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
var todos = require('../../assets/todo.json');


server.on("request", (req, res) => {
    //console.log(req);
    if (req.method == 'GET') {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(todos))
    }
    else if (req.method == "PUT") {
        let chunks = [];
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", () => {
            let todo = JSON.parse(Buffer.concat(chunks).toString());
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id == todo.id) todos[i] = todo
            }
            let jsonContent = JSON.stringify(todos)
            fs.writeFile('../../assets/todo.json', jsonContent, 'utf8', (err) => {
                if (err) console.log('JSON ERR', err)
                console.log("JSON UPDATED")
            });
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end();
        });
    }
    else if (req.method == "DELETE") {
        let pathName = url.parse(req.url).pathname;
        let eIndex = pathName.lastIndexOf('/');
        let id = pathName.substring(eIndex + 1, pathName.length)
        console.log(Number.parseInt(id))
        todos = todos.filter(t => t.id != id)
        let jsonContent = JSON.stringify(todos)
        fs.writeFile('../../assets/todo.json', jsonContent, 'utf8', (err) => {
            if (err) console.log('JSON ERR', err)
            console.log("JSON DELETED")
        });
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end();
    }
    else if(req.method == "POST")
    {
        let max = 0;
        for (let i=0; i< todos.length;i++) {
            if(todos[i].id>max) max=todos[i].id;
        }
        let chunks = [];
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", () => {
            let todo = JSON.parse(Buffer.concat(chunks).toString());       
            todo.id = (max+1)
            todos.push(todo)
            let jsonContent = JSON.stringify(todos)
            fs.writeFile('../../assets/todo.json', jsonContent, 'utf8', (err) => {
                if (err) console.log('JSON ERR', err)
                console.log("JSON INSERT")
            });
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(todo));
        });
    }
});

server.listen(3000, () => console.log("PORT 3000"));