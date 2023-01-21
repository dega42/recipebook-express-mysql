const connect = require('../services/db');
const slugify = require('slugify');

class Recipe {
	constructor(recipe) {
		this.title = recipe.title;
		//this.slug = slugify(recipe.title);
		this.slug = recipe.title;
		this.image = recipe.image;
		this.description = recipe.description;
		this.ingredients = recipe.ingredients;
		this.directions = recipe.directions;
	}
	static getAll(result) {
		let query = "SELECT * FROM recipes";
		connect.query(query, (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}
			result(null, res);
		});
	}
	static getBySlug(slug, result) {
		let query = 'SELECT * FROM recipes WHERE slug = ?';
		connect.query(query, slug, (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}
			result(null, res);
		});
	}
	static getById(id, result) {
		let query = 'SELECT * FROM recipes WHERE id = ?';
		connect.query(query, id, (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}
			console.log(res.length);
			result(null, res);
		});
	}
	static delete(id, result) {
		let query = 'DELETE FROM recipes WHERE id = ?';
		connect.query(query, id, function (err, res) {

			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}

			console.log(`deleted ${res.affectedRows} recipe`);
			result(null, res);
		});
	}
	static create(recipe, result) {
		let query = 'INSERT INTO recipes SET ?';
		if (recipe.title == '') {
			result('Title is required!', null);
			return;
		}
		connect.query(query, recipe, (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}
			console.log("created recipe: ", { id: res.insertId, ...recipe });
			result(null, { id: res.insertId, ...recipe });
		});
	};
	static update(id, recipe, result) {
		let query = 'UPDATE recipes SET title = ?, slug = ?, image = ?, description = ?, ingredients = ?, directions = ? WHERE id = ?';
		if (recipe.title == '') {
			result('Title is required!', null);
			return;
		}
		let data = Object.values(recipe);
		data.push(id);
		connect.query(query, data, (err, res) => {
			if (err) {
				console.log("error: ", err);
				result(err, null);
				return;
			}
			console.log("updated recipe: ", { id: res.insertId, ...recipe });
			result(null, { id: res.insertId, ...recipe });
		});
	};
}

module.exports = Recipe;
