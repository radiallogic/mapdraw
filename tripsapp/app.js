const express = require('express')
const app = express()
const port = 3000

const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017/"; // tripsapp 


app.use(express.json());

app.use('/', express.static('client'));

const objects = ['trips', 'kitlists', 'routes', 'vehicles', 'sites']; 

// app.get('/api/:object/:id', (req, res) => {
// 	console.log(req.params);

// 	mongo.connect(url, (err, client) => {
// 		if (err) {
// 			console.error(err);
// 			return 
// 		}

// 		let object = req.params.object;
// 		//TODO: validate object is in objects
// 		// console.log("id"); 
// 		// console.log(object); 

// 		const db = client.db('tripsapp')
// 		const collection = db.collection(object)

// 		let query = {};
// 		if(req.params.id != '-1'){
// 			query = { _id : new ObjectID(req.params.id) };
// 		}

// 		collection.find(query).toArray((err, items) => {
// 			res.send(items);
// 		})
// 	})
// })


app.get('/api/:object/', (req, res) => {
	//console.log('params: ', req.params);

	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}

		let object = req.params.object;
		//TODO: validate object is in objects

		const db = client.db('tripsapp')
		const collection = db.collection(object)

		let query = {};
		
		collection.find(query).toArray((err, items) => {
			res.send(items);
		})
	})
})

app.post('/api/:object/', (req, res) => { // data/data:

	console.log('Got a POST request'); 
	console.log('body is ', req.body);
	
	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err);
			return 
		}
		const db = client.db('tripsapp')
		const collection = db.collection(req.params.object)


		let body = req.body;
		if(body._id == null){
			body._id = new ObjectID();
			collection.insertOne(req.body, (err, result) => {
				if(err == null){
					console.log('Returning from Insert', result.ops);
					res.send(result.ops[0])
				}else{
					//TODO check this for security
					res.send(err)
					console.log('error: ', err)
				}
			})
		}else{

			const id = new ObjectID(body._id);
			let update = {...body};
			delete update._id;
			
			collection.updateOne({_id: id },  { $set: update} , (err, result) => {
				if(err == null){
					console.log(" Returning from Update: ", body);
					res.send(body)
				}else{
					//TODO check this for security
					res.send(err)
					console.log('error: ', err)
				}
			})
		}

		
	})

	
})

// app.put('/api/:object', (req, res) => {

// 	console.log('Got a PUT request'); 
// 	console.log('body is ',req.body);
   

// 	mongo.connect(url, (err, client) => {
// 		if (err) {
// 			console.error(err);
// 			return 
// 		}
// 		const db = client.db('tripsapp')
// 		const collection = db.collection(req.params.object)

// 		collection.insertOne(res.body);
// 	})

// 	//res.send(req.body);
// })

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