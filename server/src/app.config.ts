import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import cors from "cors";
const path = require('path');
const fs = require('fs');

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {

        app.use(cors());
        // {
        //     //origin: 'https://allowed-domain.com', // 실제 허용할 도메인
        //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
        //     allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Origin', // 허용할 헤더
        // }
        
        app.get('/image/:imageName', (req, res) => {
            
            const imageName = req.params.imageName;
            const resultArray = imageName.split('-');
            const joinedString = resultArray.join('/');
            const imagePath = path.join(__dirname, '../assets', joinedString);
            const imageStream = require('fs').createReadStream(imagePath);
            
            res.setHeader('Content-Type', 'image/png'); 
            imageStream.pipe(res);
         });

         app.get('/json/:mapName', (req, res) => {
            const mapName = req.params.mapName;
            const resultArray = mapName.split('-');
            const joinedString = resultArray.join('/');
            const mapPath = path.join(__dirname, '../assets', joinedString);
            fs.readFile(mapPath, 'utf-8', (err: any, data: string) => {
                if (err) {
                    console.error('Error reading JSON file:', err);
                    return;
                }
                try {
                    const jsonData = JSON.parse(data);
                    res.setHeader('Content-Type', 'application/json');
                    res.json(jsonData);
                } catch (jsonErr) {
                    res.status(500).send('Error parsing JSON');
                }
            });

           
         });

        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
