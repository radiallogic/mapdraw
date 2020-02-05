const express = require('express')
const app = express()
const port = 3000

mongo = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID;


var url = "mongodb://localhost:27017/"; // tripsapp 


app.use('/', express.static('client'));

const objects = ['trips', 'kitlists', 'routes', 'vehicles', 'sites']; 

app.get('/api/:object/:id', (req, res) => {
	console.log(req.params);

	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}

		let object = req.params.object;
		//validate object is in objects
		console.log("id"); 
		console.log(object); 

		const db = client.db('tripsapp')
		const collection = db.collection(object)

		let query = {};
		if(req.params.id != '-1'){
			query = { _id : new ObjectID(req.params.id) };
		}

		collection.find(query).toArray((err, items) => {
			res.send(items);
		})
	})
})


app.get('/api/:object/', (req, res) => {
	console.log(req.params);

	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}

		let object = req.params.object;
		//validate object is in objects

		console.log("collection"); 
		console.log(object); 

		const db = client.db('tripsapp')
		const collection = db.collection(object)

		let query = {};
		
		collection.find(query).toArray((err, items) => {
			res.send(items);
		})
	})
})

app.post('/api/:object/data/data:', (req, res) => {
	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}
		const db = client.db('tripsapp')
		const collection = db.collection(req.params.object)

		collection.insertOne(req.params.data, (err, result) => {

		})
	})
	//res.send('Got a POST request')
})

app.put('/api/:object', (req, res) => {
	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}
		const db = client.db('tripsapp')
		const collection = db.collection(req.params.object)

		// collection.deleteOne({name: 'Togo'}, (err, item) => {
		// 	console.log(item)
		// })
	})
})

app.delete('/api/:object/:id', (req, res) => {

	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}
		const db = client.db('tripsapp')
		const collection = db.collection(req.params.object)

		collection.deleteOne({name: 'Togo'}, (err, item) => {
			console.log(item)
		})
	})
	
 	res.send('Got a DELETE request')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))