/// <reference path="../typings/node/node.d.ts"/>
var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');

	
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ 
		dialect: protocol,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, // solo SQLite (.env)
		omitNull: true // solo Postgres
	}
);

	
//importar definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar definicion de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Relaciones
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //Exportar deficnion tabla Quiz
exports.Comment = Comment;
exports.Sequelize = sequelize;

//Sequelize.sync() crea e inicializa la tabla

sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0){ //Solo inicializar la tabla si esta vacia
			Quiz.create({ 
						 pregunta: 'Capital de Italia',
						 respuesta: 'Roma',
						 tema:'humanidades'
						});
			Quiz.create({ 
						 pregunta: 'Capital de Portugal',
						 respuesta: 'Lisboa',
						 tema:'humanidades'
						})
			.then(function(){console.log('Base de datos inicializada');});
		}
	});
});
