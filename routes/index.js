var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statsController = require('../controllers/stats_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Autoload de quizId si esta en query, body o param
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

//Definicion de rutas de /quizes
router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
router.get('/quizes/new',sessionController.loginRequired, quizController.new);
router.post('/quizes/create',sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired, quizController.destroy);

router.get('/author',function(req, res, next) {
  res.render('author', {errors: []});
});

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);


// Definición de rutas de sesion
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

//Estadisticas
router.get('/quizes/statistics', statsController.calculate);

module.exports = router;
