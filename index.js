import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const PORT = process.env.PORT || 3001;
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

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

function idGenerator() {
  let startId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
  return () => {
    startId += 1;
    return startId;
  };
}

const nextId = idGenerator();

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>`
    + `<p>${new Date()}`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (!person) {
    response.status(404).json({ error: 'person not found' });
  } else {
    response.json(person);
  }
});

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const existingPerson = persons.find(p => p.name === request.body.name);
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: nextId(),
    name: request.body.name,
    number: request.body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.put('/api/persons/:id', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const id = Number(request.params.id);
  const existingPerson = persons.find(person => person.id === id);

  if (!existingPerson) {
    response.status(404).json({ error: 'person not found' });
  } else {
    const updatedPerson = {
      id: existingPerson.id,
      name: request.body.name,
      number: request.body.number,
    };
    persons = persons.map(person => person.id !== id ? person : updatedPerson);
    response.json(updatedPerson);
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
