const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  },
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody",
  ),
);

morgan.token("reqbody", (request, response) => {
  return JSON.stringify(request.body);
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.send(person);
  } else {
    response.status(404).end();
  }
});

// app.put("/api/persons/:id", (request, response) => {
//   const body = request.body;
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id)
//   const newPerson = {
//     name: body.name,
//     number: body.number,
//     id: id
//   }
//   persons = persons.concat(newPerson);
//   response.send(newPerson);
//   response.status(204).end();
// })

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing.",
    });
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "Name already present.",
    });
  }

  const person = {
    "name": body.name,
    "number": body.number,
    "id": generateId(),
  };

  console.log(person)

  persons = persons.concat(person);
  response.send(person);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
