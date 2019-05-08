https://guides.github.com/features/mastering-markdown/

# Creación de backend

## Iniciar servidor express

1. Crear archivo app.js
```javascript
var express = require('express');
var app = express();
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});
```

2. Colores para textos en consola
* Reset = "\x1b[0m"
* Bright = "\x1b[1m"
* Dim = "\x1b[2m"
* Underscore = "\x1b[4m"
* Blink = "\x1b[5m"
* Reverse = "\x1b[7m"
* Hidden = "\x1b[8m"
* FgBlack = "\x1b[30m"
* FgRed = "\x1b[31m"
* FgGreen = "\x1b[32m"
* FgYellow = "\x1b[33m"
* FgBlue = "\x1b[34m"
* FgMagenta = "\x1b[35m"
* FgCyan = "\x1b[36m"
* FgWhite = "\x1b[37m"
* BgBlack = "\x1b[40m"
* BgRed = "\x1b[41m"
* BgGreen = "\x1b[42m"
* BgYellow = "\x1b[43m"
* BgBlue = "\x1b[44m"
* BgMagenta = "\x1b[45m"
* BgCyan = "\x1b[46m"
* BgWhite = "\x1b[47m"

Ejemplo:
console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');

3. Crear las rutas con los códigos de respuesta
```javascript
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});
```

4. Instalar el nodemon para reiniciar el servidor automáticamente

Global: npm install -g nodemon
Local: npm install --save-dev nodemon

```json
"scripts": {
    "start": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

npm start

5. Instalar mongoose para conectarme a una base de datos Mongo

npm install mongoose

6. Conectarme a la base de datos luego de correr mongod

sudo mongod

```javascript
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});
```

