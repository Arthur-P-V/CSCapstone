console.log("Hello via Bun!");

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("Evil Things are coming yoru way!");
    },
});

console.log(`Listening on http://localhost:${server.port}`)