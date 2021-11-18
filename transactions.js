const session = db.getMongo().startSession()

const userCol = session.getDatabases("blog").users
const postCol = session.getDatabases("blog").posts

// start transactions
session.startTransaction()
postCol.deleteMany({})

session.commitTransaction()


