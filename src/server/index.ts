import * as http from 'http';
const hostname = 'localhost';
const server: http.Server = http.createServer();
server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
});
server.listen(3000, hostname);
