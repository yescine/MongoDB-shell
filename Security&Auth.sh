# activate auth 
mongod --auth

# connect to desired auth
mongo --uri="some uri"

# add first user
use admin
db.createUser({user:"name",pwd:"pwd",role:["userAdminAnyDatabase"]})

# authenticate 
db.auth('name','pwd')