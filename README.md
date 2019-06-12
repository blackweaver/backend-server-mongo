https://guides.github.com/features/mastering-markdown/

# Creación de backend

## Iniciar servidor express

1. Se debe instalar mongo

brew install mongodb
mkdir -p /data/db
sudo chown -R `id -un` /data/db
sudo mongod

https://franyerverjel.com/blog/instalar-mongodb-en-un-mac/

2. Installar Robo 3T para administrar las bases de datos mongo

3. Crear archivo app.js
```javascript
var express = require('express');
var app = express();
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});
```

4. Colores para textos en consola
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

5. Crear las rutas con los códigos de respuesta
```javascript
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});
```

6. Instalar el nodemon para reiniciar el servidor automáticamente

Global: npm install -g nodemon
Local: npm install --save-dev nodemon

```json
"scripts": {
    "start": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

7. Instalar mongoose para conectarme a una base de datos Mongo

npm install mongoose --save

8. Conectarme a la base de datos luego de correr mongod

sudo mongod

```javascript
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if( err ) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});
```

9. Actualizo en GIT el setup del backend

    1. Creo un repo en gitHub
    2. git init
    3. git status
    4. Creo un archivo .gitignore para ignorar node_modules
    5. git add .
    6. git commit -m "Primer commit"
    7. git remote add origin git@github.com:blackweaver/backend-server-mongo.git
    8. git push -u origin master 
    9. git tag -a v0.0.1 -m "Fin de la sección 9"
    10. git tag
    11. git push --tags

10. Ejecutar el backend luego de ejectuar proceso de mongo

npm start

11. Creo un endpoint para obtener los usuarios desde la base de datos mongo

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }
});

module.exports = mongoose.model('Usuario', usuarioSchema)
```

```javascript
var express = require('express');

var app = express();

var Usuario = require('../models/usuario');


app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
        });
});
```

12. Creo un post para crear usuarios

npm install body-parser --save

```javascript
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado ) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

});
```

13. Plugin para validar inserciones en db

npm install mongoose-unique-validator --save

```javascript
var uniqueValidator = require('mongoose-unique-validator');
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});
```

14. Manejo de roles

```javascript
var rolesValidos = {
    values: ['ADMIN_ROLE',"USER_ROLE"],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});
```

15. Librería para encriptar contraseñas

npm install bcryptjs

16. Método post para crear usuarios con password encriptado

```javascript
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado ) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

});
```

17. Método para borrar usuarios

```javascript
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            }

            if(!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID',
                    errors: { message: 'No existe un usuario con ese ID'}
                });
            }
    
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
    
    });
});
```

18. Login de usuarios

Creo un archivo de rutas independiente para el login de usuarios

```javascript
var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();
var Usuario = require('../models/usuario');

app.post("/", (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: err
            });
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errors: err
            });
        }

        // Crear un token!!!

        if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id
        });

    });
    
});

module.exports = app;
```

Importo las rutas desde el archivo general de la APP

```javascript
var loginRoutes = require('./routes/login');

app.use('/login', loginRoutes);
```

19. Crear un token

`npm install jsonwebtoken`

20. Revisión del token

```javascript
var SEED = require('../config/config').SEED;
```

21. Optimizar middleware para darle flexibilidad a la solicitud de token

Creo una carpeta middleware y dentro un archivo del tipo autenticate.js

Lo importo donde lo necesito:

```javascript
var mdAutenticacion = require('../middlewares/autenticate');
```

```javascript
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        console.log(decoded);

        req.usuario = decoded.usuario;
        req.hola = 'holaaaaa';

        next();
        
    });

};
```