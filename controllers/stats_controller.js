var models = require('../models/models.js');

//Calcula las estadisticas
exports.calculate = function(req, res, next){
	
	var stats = {
		totalPreguntas:0,
		totalComentarios:0,
		promedioComentarios:0,
		preguntasComentadas:0,
		preguntasNoComentadas:0
	};
	//total de preguntas
	models.Quiz.count().then(function(count){
		stats.totalPreguntas = count;
		
		//Total comentarios
		models.Comment.count().then(function(count){
			stats.totalComentarios = count;
			stats.promedioComentarios = stats.totalComentarios / stats.totalPreguntas;
			
			//Preguntas con comentarios
			var qry='select COUNT(DISTINCT `QuizId` ) as num from "Comments"';
			//var qry = 'SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")';
			models.Sequelize.query(qry)
			.then(function( results ){
								
				stats.preguntasComentadas = results[0][0].num;
				stats.preguntasNoComentadas = stats.totalPreguntas - stats.preguntasComentadas;
				
				console.log('Total preguntas: ' + stats.totalPreguntas);
				console.log('Total Comentarios: ' + stats.totalComentarios);
				console.log('Promedio Comentarios: ' + stats.promedioComentarios);
				console.log('Preguntas Comentadas: ' + stats.preguntasComentadas);
				console.log('Preguntas No Comentadas: ' + stats.preguntasNoComentadas);
	
				res.render('quizes/stats.ejs', {stats:stats, errors: []});			
			});
										

		});

	});
				
	
	//Falta redirect a la pagina
	//res.render('quizes/stats.ejs', {stats:stats, errors: []});
	return;
};