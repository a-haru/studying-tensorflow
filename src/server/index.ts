import * as nodeStatic from 'node-static';
import * as http from 'http';
import * as path from 'path'

const file: nodeStatic.Server = new nodeStatic.Server(path.resolve(__dirname, '..', 'public'));

const server: http.Server = http.createServer((req, res)=>{
    req.addListener('end', () => {
        console.log(req.url);
        file.serve(req, res);
    }).resume();
}).listen(3000);
