console.log("Hello via Bun!");

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("Jon Branch?");
    },
});

console.log(`Listening on http://localhost:${server.port}`)