function displayText(){
    const container = document.getElementById("container");
    const newParagraph = document.createElement("p");
    newParagraph.textContent = "This is calling a different js file";
    container.appendChild(newParagraph);
}
displayText();
//console.log("Hello via Jon Desktop!");
//
//const server = Bun.serve({
//    port: 3000,
//    fetch(req) {
//        return new Response("Welcome to the Jon Branch, we have cookies!");
//    },
//    
//});
//
//console.log(`Listening on http://localhost:${server.port}`)