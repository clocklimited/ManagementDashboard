# Mangement Dashboard

## Setup
```
npm install
```

## Running
### Development
Place the key file in the ```/lib/binary``` directory.

Run server with ```KEY_FILE=./binary/keyfile.json nodemon server.js```

Watch index.js with ```npm run watch```

Open browser to ```localhost:9001```

### Normal Use
Build index.js with ```npm run build```

Place the key file in the ```/lib/binary``` directory.

Run server with ```KEY_FILE=./binary/keyfile.json node server.js```

Open browser to ```localhost:9001```