const User = require('./models/user')

let model = new User();

model.userName = 'Test';
model.passWord = 'passTest';

console.log(model.toJSON())  // Output model fields as JSON
