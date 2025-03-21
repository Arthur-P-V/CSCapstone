console.log("Hello Jon!");

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("Is this the JonBranch!");
    },
});

console.log(`Listening on http://localhost:${server.port}`)