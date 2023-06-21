db = connect('mongodb://localhost/mapdraw');
db.dropDatabase()

db.users.insert({
  "_id": ObjectId("5ec77cca480c894f89cccac5"), "tokens": [], "email": "psykx.out@gmail.com",
  "password": "$2b$10$iRxi8wL0PI4LkNl26N1uheCPUnNL23NxgLtcJhtRAoJLZwKo95wla", "createdAt": ISODate("2020-05-22T07:18:34.661Z"),
  "updatedAt": ISODate("2020-05-22T07:18:34.661Z"), "__v": 0
})


db.trips.insert({ "user": "5ec77cca480c894f89cccac5", "name": "trip 1", 'position': [51.454, -2.587], 'zoom': 6, 'route': [], 'sites': [], 'vehicle': '' })
db.trips.insert({ "user": "5ec77cca480c894f89cccac5", "name": "trip 2", 'position': [51.454, -2.587], 'zoom': 6, 'route': [], 'sites': [], 'vehicle': '' })
db.trips.insert({ "user": "5ec77cca480c894f89cccac5", "name": "trip 3", 'position': [51.454, -2.587], 'zoom': 6, 'route': [], 'sites': [], 'vehicle': '' })
db.trips.insert({ "user": "5ec77cca480c894f89cccac5", "name": "trip 4", 'position': [51.454, -2.587], 'zoom': 6, 'route': [], 'vehicle': '' })

db.sites.insert({})

db.kitlists.insert({})

db.vehicles.insert({ "name": "Canoe" })
db.vehicles.insert({ "name": "Paraglider" })
db.vehicles.insert({ "name": "Kite ski" })
db.vehicles.insert({ "name": "Unicycle" })
