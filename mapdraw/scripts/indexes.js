db = connect('mongodb://localhost/mapdraw');

db.createCollection("trips");
db.createCollection("sites");
db.createCollection("routes");
db.createCollection("kitlists");
db.createCollection("vehicles");

//['trips', 'kitlists', 'routes', 'vehicles', 'sites']

//db.sites.createIndex( { location : "2dsphere" } )
//db.sites.createIndex( { CLASS : 1 } )