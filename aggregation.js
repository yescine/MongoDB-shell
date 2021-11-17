db.persons.aggregate([
	{ $match: { gender: "female" } },
	{ $group: { _id: { state: "$location.state" }, totalPerson: { $sum: 1 } } },
	{ $sort: { totalPerson: -1 } }
]).pretty()

// project
db.persons.aggregate([
	{
		$project: {
			_id: 0, gender: 1,
			fullName: {
				$concat: [
					{ $toUpper: { $substrCP: ["$name.first", 0, 1] } },
					{ $substrCP: ["$name.first", 1, { $subtract: [{ $strLenCP: "$name.first" }, 1] }] },
					" ",
					"$name.last"]
			},
			location: "$location.state"
		}
	},
	{ $sort: { fullName: 1 } }
]).pretty()

// convert GeoJson and date
db.persons.aggregate([
	{
		$project: {
			_id: 0,
			name: 1,
			email: 1,
			birthdate: { $toDate: '$dob.date' },
			age: "$dob.age",
			location: {
				type: 'Point',
				coordinates: [
					{
						$convert: {
							input: '$location.coordinates.longitude',
							to: 'double',
							onError: 0.0,
							onNull: 0.0
						}
					},
					{
						$convert: {
							input: '$location.coordinates.latitude',
							to: 'double',
							onError: 0.0,
							onNull: 0.0
						}
					}
				]
			}
		}
	},
	{
		$project: {
			gender: 1,
			email: 1,
			location: 1,
			birthdate: 1,
			age: 1,
			fullName: {
				$concat: [
					{ $toUpper: { $substrCP: ['$name.first', 0, 1] } },
					{
						$substrCP: [
							'$name.first',
							1,
							{ $subtract: [{ $strLenCP: '$name.first' }, 1] }
						]
					},
					' ',
					{ $toUpper: { $substrCP: ['$name.last', 0, 1] } },
					{
						$substrCP: [
							'$name.last',
							1,
							{ $subtract: [{ $strLenCP: '$name.last' }, 1] }
						]
					}
				]
			}
		}
	},
	// { $group: { _id: { birthYear: { $isoWeekYear: "$birthdate" } }, numPersons: { $sum: 1 } } },
	// { $sort: { numPersons: -1 } }
]).pretty();

// Unwinds and add only non-duplicate
db.friends.aggregate([
	{ $unwind: "$hobbies" }, 
	{ $group: { _id: { age: "$age" }, allHobbies: { $addToSet: "$hobbies" } } }
]).pretty();

// 
db.friends.aggregate([
	{ $unwind: "$examScores" },
	{ $project: { _id: 1, name: 1, age: 1, score: "$examScores.score" } },
	{ $sort: { score: -1 } },
	{ $group: { _id: "$_id", name: { $first: "$name" }, maxScore: { $max: "$score" } } },
	{ $sort: { maxScore: -1 } }
]).pretty();

// $bucket
db.persons
  .aggregate([
    {
      $bucket: {
        groupBy: '$dob.age',
        boundaries: [18, 30, 40, 50, 60, 120],
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: '$dob.age' }
        }
      }
    }
  ])
  .pretty();

// deep dive agregate

db.persons.aggregate([
	{ $match: { gender: "male" } },
	{ $project: { _id: 0, gender: 1, name: { $concat: ["$name.first", " ", "$name.last"] }, birthdate: { $toDate: "$dob.date" } } },
	{ $sort: { birthdate: 1 } },
	{ $skip: 10 },
	{ $limit: 10 }
]).pretty();

