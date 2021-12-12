const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Usage: node mongo.js <password> [<name>] [<number>]");
  process.exit(1);
}

if (process.argv.length >= 3) {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const password = process.argv[2];
  const url =
    `mongodb+srv://ytrms:${password}@cluster0.amdjh.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

  mongoose.connect(url);

  if (process.argv.length === 3) {
    Person.find({}).then((result) => {
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
  } else {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    person.save()
      .then((result) => {
        console.log(
          `Added ${result.name} with number ${result.number} to phonebook.`,
        );
        mongoose.connection.close();
      });
  }
}
