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
	res.render('pages/main/new-recipe', { meta, recipe });
};

exports.getEdit = (req, res) => {
	const meta = metas.find(e => e.name == 'edit-recipe');
	Recipe.getBySlug(req.params.slug, function (err, recipe) {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving recipe."
			});
		else {
			res.render('pages/main/edit-recipe', { meta, recipe: recipe[0] });
		}
	});
};
exports.findAll = (req, res) => {
	const meta = metas.find(e => e.name == 'recipes');
	Recipe.getAll((err, recipes) => {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving recipes."
			});
		else {
			res.render('pages/main/recipes', { meta, recipes });
		}
	});
};



exports.findBySlug = (req, res) => {
	const meta = metas.find(e => e.name == 'recipe');
	Recipe.getBySlug(req.params.slug, function (err, recipe) {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving recipes."
			});
		else {
			meta.title += ` - ${recipe[0].title}`;
			res.render('pages/main/recipe', { meta, recipe: recipe[0] });
		}
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
	Recipe.update(req.params.id, recipe, function(err, recipe) {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving recipes."
			});
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
	
	
	Recipe.create(recipe, function (err, recipe) {
		if (err)
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving recipes."
			});
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