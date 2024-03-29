mongoimport --db=test --collection=friends --file=friends.json --jsonArray
> use <DB name>

> db.product.insertMany([{name:"many",price:12,company:"e-ERP-TN"},{name:"other many",price:12,company:"e-ERP-TN"}])
> db.company.insertMany([{name:"e-ERP-TN",location:"TN",registredAt:new Date()},{name:"siemens",location:"GE",rehisteredAt:new Date()}])
> db.product.aggregate([{$lookup:{from:"company",localField:"company",foreignField:"name",as:"company"}}]).pretty()

// that include Drama in array
	db.tvShows.find({genres:"Drama"}).pretty()
// that include only Drama & Horror
	db.tvShows.find({genres:{$all: ["Drama","Horror"] } }).pretty()
// in array operator
	db.tvShows.find({runtime:{$in:[30,42]}}).pretty()
	// task management
	db.projects.find({_id:ObjectId("xxx"),"tasks.status":{$in{["on progress","in review"]}}})
// logic operation on array of operations
	db.tvShows.find({$or:[{"rating.average":{$lt:5}},{"rating.average":{$gt:9}}]}).pretty()
	db.tvShows.find({$and:[{"rating.average":{$lt:7}},{"genres":"Drama"}]}).count()
// not equal
	db.tvShows.find({$and:[{"rating.average":{$lt:7}},{"genres":"Drama"}]}).count()
// Field exist
	db.product.find( { detail:{$exists:true},price:{$eq:1113} } ).pretty()
// Type date 
	db.product.find( {registeredAt:{$type:["date","string"]}} ).pretty()
// reg expression
    db.tvShows.find({summary:{$regex:/musical comedy/}})
// expression
	
// Path embded Approch: search in embeded array object
	db.user.find({"hobbies.title":"sports","hobbies.frequency":{$gt:2}})
	db.product.find({"rating.stars":{$gte:3}}).pretty()
	db.product.find({"rating":{$size:2}}).pretty()
	
// element Match same embeded Document
	db.user.find({"hobbies": {$elemMatch:{title:"sports",frequency:{$gte:2}}} } )

// UPDATE
// $set update only Field
	db.acamindUser.updateMany({"hobbies.title":"Sports"},{$set:{isSporty:true}})
	let newMeta = {age:20,location:"germany"}
	db.acamindUser.updateMany({"hobbies.title":"Sports"},{$set:{...newMeta}})
// get rid of field
	db.acamindUser.updateMany({"hobbies.title":"Sports"},{$unset:{phone:""}})
// Rename field
	db.acamindUser.updateMany({"hobbies.title":"Sports"},{$rename:{phone:"phones"}})
// Update or Add ,{upsert:true}
// update array search only the element that match the Query
	db.acamindUser.updateMany({"hobbies":{$elemMatch:{title:"Sports",frequency:{$gte:3}}}},{$set:{"hobbies.$.highFrequency":true}})
	// in case Task Management
	db.project_collections.updateOne({"tasks":{$elemMatch:{_id:row.taskId}}},{$set:{"tasks.$":row}})
// update all element of arrays
	db.users.updateMany({totalAge:{$gt:30}},{$set:{"hobbies.$[].frequency":"high"})
// update all element of arrays With Filter
	db.acamindUser.updateMany({"hobbies.frequency":{$gte:2}},{$set:{"hobbies.$[elem].goodFrequency":true}},{arrayFilters:{"elem.freqyency":{$gte:3}})

// Add Objecy to subArray
	db.acamindUser.updateOne({name:"Anna"},{$push:{hobbies:{$each:[{title:"other 11" ,frequency:11},{title:"other 22",frequency:22}],$sort:{frequency:-1}}}})
// Remove Object from array
	db.acamindUser.updateOne({name:"Anna"},{$pull:{hobbies:{frequency:{$gte:10}}}})


// Exercice

let data = { title:"proj1",company:["vital","plomb"],tasks:[{subject:"t1"},{subject:"t2",subject:"t3"}] }
let data2 = { title:"proj2",company:["cart","form"],tasks:[{subject:"s1"},{subject:"s2",subject:"s3"}] }
db.trial.insertMany([data,data2])
db.update({_id:ObjectId("619d0804d4244813d2be4c77"),"tasks":{$elemMatch:{subject:"t1"}}},{$set:{"tasks.$.progress":22}})
db.trial.find({company:"cart"}})
db.trial.update({company:"cart"},{$addToSet:{company:"new comp"}})

// return only tasks
 db.project_collections.aggregate([{$match:{title:"00TestTag"}},{$project:{tasks:1}},{$project:{"tasks.history":0}}]).pretty()

 db.project_collections.aggregate([
	{$match:{title:"00TestTag"}},
	{$project:{tasks:1,_id:0}},
	{$project:{"tasks.history":0}},
	{$addFields:{"tasks.fetchedDate":new Date()}},
	{$project:{tasks:{$filter:{input:"$tasks",as:"task",cond:{$in:["$$task.status",["completed", "in progress"]]}}}}},
	{$unwind:"$tasks"},
	{$replaceWith: "$tasks" }
]).pretty()

// explanation
 db.project_collections.aggregate([
	// search project 
	{$match:{title:"00TestTag"}},
	// select tasks fields
	{$project:{tasks:1,_id:0}},
	// remove history from every task in the array
	{$project:{"tasks.history":0}},
	// add optional field in every task
	{$addFields:{"tasks.fetchedDate":new Date()}},
	// filtser tasks with some field
	{$project:{tasks:{$filter:{input:"$tasks",as:"task",cond:{$in:["$$task.status",["completed", "in progress"]]}}}}},
	// regroup for output result
	{$unwind:"$tasks"},
	{$replaceWith: "$tasks" }
]).pretty()

// better result
 db.project_collections.aggregate([
	{$match:{title:"00TestTag"}},
	{$project:{tasks:1,_id:0}},
	{$unwind:"$tasks"},
	{$replaceWith: "$tasks" },
	{$project:{history:0}},
	{$addFields:{"fetchedDate":new Date(),"summary":{$concat:["$$ROOT.subject","||","$$ROOT.notes"]} }},
	{$match:{$or:[{"status":"completed"},{status:"assigned"}]}}
]).pretty()

// DB statistic
// calculate number of project and tasks


 db.project_collections.aggregate([
	{$project:{tasksCount:{$sum:"$tasks"} }},
	{$group:{
		_id:null,
		projectCount:{ $sum:1},
		tasksCount:{$sum:"$tasksCount"}
	}}
]).pretty()
