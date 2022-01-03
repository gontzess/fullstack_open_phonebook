import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import PersonsDB from './database/PersonsDB.js';
import Person from './database/Person.js';

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.static('./react-ui/build'));
app.use(express.json());

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

(async () => await PersonsDB.init())();

app.get('/info', async (request, response) => {
  const persons = await PersonsDB.findAll();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>`
    + `<p>${new Date()}`
  );
});

app.get('/api/persons', async (request, response) => {
  const persons = await PersonsDB.findAll();
  response.json(persons);
});

app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const person = await PersonsDB.findById(id);
    if (!person) {
      response.status(404).json({ error: 'person not found' });
    } else {
      response.json(person);
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body;
  try {
    Person.validateData(name, number);
    const existingPerson = await PersonsDB.findByName(name);
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' });
    }

    const person = await PersonsDB.insert({ name, number });
    if (!person) {
      response.status(404).json({ error: 'person not found' });
    } else {
      response.json(person);
    }
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body;
  const id = request.params.id;
  try {
    Person.validateData(name, number);
    const updatedPerson = await PersonsDB.update(id, { number });
    if (!updatedPerson) {
      response.status(404).json({ error: 'person not found' });
    } else {
      response.json(updatedPerson);
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    await PersonsDB.delete(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

function unknownEndpoint(request, response) {
  response.status(404).json({ error: 'unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  console.error(error.name, '-', error.message);
  if (error.name === 'BSONTypeError') {
    return response.status(400).json({ error: 'id is invalid' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
