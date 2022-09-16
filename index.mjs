import { createServer } from "http";
import { createHash } from "crypto";

function md5(str) {
  return createHash("md5").update(str).digest("hex");
}

let server = createServer((request, response) => {
  switch (request.url) {
    case "/": {
      let html = createPage("Home");
      let etag = md5(html);
      if (etag === request.headers["if-none-match"]) {
        response.writeHead(304);
        response.end();
      } else {
        response.writeHead(200, {
          //sets cache control to store for 10 seconds using an etag
          "cache-control": "max-age=10",
          etag,
        });
        response.end(html);
      }
      break;
    }
    case "/page-1": {
      let html = createPage("Page1");
      response.writeHe(200, {
        // sets cache control to not store data
        "cache-control": "no-store",
      });
      response.end(html);
      break;
    }
  }
});

server.listen(3000);
console.log("Node server running on port 3000 🚀");

////////////////////////////////////////

function createPage(title) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <link rel ="favicon"
      href="https://remix/run/favicon.ico/>"
    </head>
    <body>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/page-1">Page 1</a></li>
      </ul>
      <h1>${title}</h1>
    </hr>
      ${Array.from({ length: 1000 })
        .map(() => "<div> I am junk!</div>")
        .join("\n")}
    </body>
  </html>
  `;
}
