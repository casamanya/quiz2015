var path = require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');

//usar BBDD
var sequelize = new Sequelize(null, null, null, 
		{dialect : "sqlite", storage : "quiz.sqlite"}
	);
	
//importar definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //Exportar deficnion tabla Quiz

//Sequelize.sync() crea e inicializa la tabla

sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0){ //Solo inicializar la tabla si esta vacia
			Quiz.create({ 
						pregunta: 'Capital de Italia',
						 respuesta: 'Roma'
						})
			.then(function(){console.log('Base de datos inicializada');});
		}
	});
});
