var models = require('../models/models.js');

//Load
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function (quiz){
			if (quiz){
				req.quiz=quiz;
				next();
			} else {
				next(new Error('No existe el quizId = ' + quizId));
			}
		}
	).catch(function(error){next(error);});
	
};

//GET quizes
exports.index = function(req, res){
	var search= req.query.search;
	if (search && search.length>0){		
		search = search.trim().replace(' ','%');
		search = '%' + search + '%';
		console.log('query de preguntas like ' + search);
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function (quizes){
			res.render('quizes/index.ejs', {quizes:quizes, search: req.query.search, errors: []});
		});
	} else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs', {quizes:quizes, search:'', errors: []});
		});
	}
};


//GET quizes/:id
exports.show = function(req, res){
	res.render('quizes/show',{quiz : req.quiz, errors: []});		
};

//GET quizes/:id/answer
exports.answer = function(req, res){
	var resultado='Incorrecto';	
	if (req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';				
	}
	res.render('quizes/answer',{quiz:req.quiz, respuesta : resultado, errors: []});
	
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'otro'}
	);
	
	res.render('quizes/new', {quiz: quiz, errors: [], state:'create'});
};

//POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new',{quiz:quiz, errors: err.errors, state: 'create'});
			} else{
				quiz.save({fields: ['pregunta', 'respuesta', 'tema']}).then( function()
					{ 
						res.redirect('/quizes');
					}
				);				
			};
		}				
	);	
		
};

//GET quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	
	res.render('quizes/edit',{quiz:quiz, errors:[], state: 'edit'});
};

// PUT quizes/:id
exports.update = function(req, res) {
	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	
	req.quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/edit',{quiz:req.quiz, errors: err.errors, state: 'edit'});
			} else {
				req.quiz
				.save({fields: ['pregunta', 'respuesta', 'tema']})
				.then(function()
					{ 
						res.redirect('/quizes');
					}
				);
			}
		}
	);
};

exports.destroy = function (req, res, next ){
	req.quiz.destroy().then(
		function(){
			res.redirect('/quizes');
		}		
	).catch(
		function(error){ next(error);}
	);
};