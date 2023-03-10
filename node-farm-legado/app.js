const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate')

// server
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))

console.log(slugify('Fresh Avocados', { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(404, { 'Content-type': 'text/html' });

        const cardsHml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')

        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHml)

        res.end(output);

        //Products Page
    } else if (pathname === '/product') {

        res.writeHead(404, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);

        //API
    } else if (pathname === '/api') {

        res.writeHead(200, { 'Cotent-type': "application/json" })
        res.end(data);

        //Not Found Page
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': "deu ruim cachorro"
        });
        res.end('<h1>Page Not Found 😢</h1>');
    }


});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to requests on port 8000 🚀")
});