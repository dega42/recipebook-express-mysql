const express = require('express');
let router = express.Router();

const recipeController = require('../controllers/recipe.controller');

router.get('/new', recipeController.getNew);
router.get('/edit/:slug', recipeController.getEdit);
router.get('/', recipeController.findAll);
router.get('/:slug', recipeController.findBySlug);
router.post('/', recipeController.new);
router.put('/:id', recipeController.edit);
router.delete('/:id', recipeController.delete);

module.exports = router;