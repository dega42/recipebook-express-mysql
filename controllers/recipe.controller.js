const Recipe = require('../models/recipe.model');
const slugify = require('slugify');

const metas = require('../metas.json');

exports.getNew = (req, res) => {
	const meta = metas.find(e => e.name == 'new-recipe');
	const recipe = new Recipe({
		title: req.body.title,
		//slug: slugify(req.body.title),
		image: req.body.image,
		description: req.body.description,
		ingredients: req.body.ingredients,
		directions: req.body.directions
	});
	const err = [];
	res.render('pages/main/new-recipe', { meta, recipe, err });
};

exports.getEdit = (req, res) => {
	const meta = metas.find(e => e.name == 'edit-recipe');

	Recipe.getBySlug(req.params.slug, function (err, recipe) {
		res.render('pages/main/edit-recipe', { meta, recipe: recipe[0], err });
	});
};

exports.findAll = (req, res) => {
	const meta = metas.find(e => e.name == 'recipes');
	Recipe.getAll((err, recipes) => {
		res.render('pages/main/recipes', { meta, recipes, err });
	});
};


exports.findBySlug = (req, res) => {
	const meta = metas.find(e => e.name == 'recipe');
	Recipe.getBySlug(req.params.slug, function (err, recipe) {
		res.render('pages/main/recipe', { meta, recipe: recipe[0], err });
	})
};

exports.edit = (req, res) => {
	const recipe = new Recipe({
		title: req.body.title,
		// slug: slugify(req.body.title, { lower: true }),
		slug: req.body.title,
		image: 'image.jpg',
		description: req.body.description,
		ingredients: req.body.ingredients,
		directions: req.body.directions
	});

	//console.log(recipe);
	Recipe.update(req.params.id, recipe, function (err, recipe) {
		if (err) {

			// Recipe.getBySlug(req.body.title, function (err, recipe) {
			// 	const meta = metas.find(e => e.name == 'edit-recipe');
			// 	res.render('pages/main/edit-recipe', { meta, recipe: recipe[0], err });
			// });
			// console.log(req.body.slug);
			// console.log(req.params.id);
			//res.redirect(`/recipe/edit/${req.body.slug}`, { id: req.params.id })
			const meta = metas.find(e => e.name == 'edit-recipe');
			res.render('pages/main/edit-recipe', { recipe, meta, err });
			return;
		}
		else {

			res.redirect('/recipe')

		}
	})
}

exports.new = (req, res) => {
	const recipe = new Recipe({
		title: req.body.title,
		slug: slugify(req.body.title, { lower: true }),
		image: 'image.jpg',
		description: req.body.description,
		ingredients: req.body.ingredients,
		directions: req.body.directions
	});
	//console.log(slugify('Ez egy példaszöveg', { lower: true })); 
	//console.log(req.body.title); 

	Recipe.create(recipe, function (err, recipe = new Recipe({})) {
		if (err) {
			const meta = metas.find(e => e.name == 'new-recipe');
			console.log('RE: ', recipe = new Recipe({}));
			res.render('pages/main/new-recipe', { recipe, meta, err });
			return;
		}
		else {
			res.redirect('/recipe')
		}
	})
}

exports.delete = (req, res) => {
	Recipe.delete(req.params.id, (err, data) => {
		if (err) {
			console.log(err);
			if (err.kind === "not_found") {
				res.status(404).send({
					message: `Not found recipe with id ${req.params.id}.`
				});
			} else {
				res.status(500).send({
					message: "Could not delete recipe with id " + req.params.id
				});
			}
		} else res.redirect('/recipe')
	});
};