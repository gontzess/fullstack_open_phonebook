import { MongoClient, ObjectId } from 'mongodb';
import Person from './Person.js';

const isDev = process.env.NODE_ENV !== 'production';
const uri = process.env.MONGODB_URI;
const _client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const testData = [
  {
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
];

let _db = null;
let _collection = null;

const PersonsDB = {
  async init() {
    try {
      await _client.connect();
      _db = _client.db('phonebook');
      _collection = _db.collection('persons');
      if (isDev) {
        await _collection.drop();
        await _collection.insertMany(testData);
      }
    } finally {
      await _client.close();
    }

    return this;
  },

  async findAll() {
    let persons;
    try {
      await _client.connect();
      let foundData = await _collection.find({}).toArray();
      persons = foundData.map(data => Object.create(Person).init(data));
    } finally {
      await _client.close();
    }

    return persons;
  },

  async findById(id) {
    const _id = ObjectId.createFromHexString(id);
    let person;
    try {
      await _client.connect();
      let foundData = await _collection.findOne({ _id });
      if (foundData) {
        person = Object.create(Person).init(foundData);
      } else {
        person = null;
      }
    } finally {
      await _client.close();
    }

    return person;
  },

  async findByName(name) {
    let person;
    try {
      await _client.connect();
      let foundData = await _collection.findOne({ name });
      if (foundData) {
        person = Object.create(Person).init(foundData);
      } else {
        person = null;
      }
    } finally {
      await _client.close();
    }

    return person;
  },

  async insert(person) {
    let newPerson;
    try {
      await _client.connect();
      let insertedData = await _collection.insertOne(person);
      if (insertedData.acknowledged && insertedData.insertedId) {
        newPerson = Object.create(Person).init(
          { ...person, _id: insertedData.insertedId }
        );
      } else {
        newPerson = null;
      }
    } finally {
      await _client.close();
    }

    return newPerson;
  },

  async update(id, updates) {
    const _id = ObjectId.createFromHexString(id);
    let updatedPerson;
    try {
      await _client.connect();
      let updatedData = await _collection.findOneAndUpdate(
        { _id }, { $set: updates }, { upsert: false, returnDocument: 'after' }
      );
      if (updatedData.ok === 1 && updatedData.value !== null) {
        updatedPerson = Object.create(Person).init(updatedData.value);
      } else {
        updatedPerson = null;
      }
    } finally {
      await _client.close();
    }

    return updatedPerson;
  },

  async delete(id) {
    const _id = ObjectId.createFromHexString(id);
    let isDeleted;
    try {
      await _client.connect();
      let deletedData = await _collection.findOneAndDelete({ _id });
      isDeleted = (deletedData.ok === 1 && deletedData.value !== null);
    } finally {
      await _client.close();
    }

    return isDeleted;
  },

  async reset() {
    try {
      await _client.connect();
      if (_collection) {
        await _collection.drop();
        _collection = null;
      }
    } finally {
      await _client.close();
    }
  },
};

export default PersonsDB;

// // quick tests
// await PersonsDB.init();
//
// let allPersons = await PersonsDB.findAll();
// console.log(allPersons);
//
// let ada = await PersonsDB.findById(allPersons[1]._id);
// console.log('Ada search =>', ada);
//
// let insertResult = await PersonsDB.insert({ "name": "Test Tester", "number": "8484-378447" });
// console.log(insertResult);
//
// let updateResult = await PersonsDB.update(
//   insertResult._id,
//   { "number": "333333333" }
// );
// console.log(updateResult);
//
// // let updateResult2 = await PersonsDB.update(
// //   'sfdsg',
// //   { "number": "333333333" }
// // );
// // console.log(updateResult2);
//
// let deletedResult = await PersonsDB.delete(insertResult._id);
// console.log(deletedResult);
//
// await PersonsDB.reset();
// console.log(PersonsDB);
