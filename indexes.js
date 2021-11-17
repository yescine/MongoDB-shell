
// 
db.persons.explain("executionStats").find({"dob.age":{$gt:60}})

db.persons.createIndex({"dob.age":1})
db.persons.dropIndex({"dob.age":1})
// apply only to query that will return fraction of data, unecessary to index documents if all collection will be scanned

// compound index
db.persons.createIndex({"dob.age":1,gender:1})
db.persons.getIndex()

//unique index
db.persons.createIndex({"email":1},{unique:true})

// TimeToLive Index
db.session.createIndex({createdAt:1},{expireAfterSeconds:5})

// text Index
db.product.createIndex({description:"text"})
db.product.find({$text:{$search:"\"awesome book\""}}) 

db.product.createIndex({"tasks.subject":"text","tasks.notes":"text"},{background:true,weights:{subject:2,notes:1}})
db.project.find({_id:req.body._id,$text, $text:{$search:"\"awesome book\""}}) // use this to find search Nav bar in subject and notes columns

// GeoJson
db.places.createIndex({location:"2dsphere"})
db.places.find({location:{$near:{$geometry:{type:"Point",coordinate[lon,lat]}},$maxDistance:500, $minDistance:10}} )

