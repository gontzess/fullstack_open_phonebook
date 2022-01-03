function isValidName(name) {
  return name && typeof name === 'string' && name.length > 2;
}

function isValidNumber(number) {
  return number && typeof number === 'string' && number.length > 7;
}

const Person = {
  init({ name, number, _id }) {
    if (!isValidName(name) || !isValidNumber(number)) {
      return { invalid: true };
    }

    this.name = name;
    this.number = number;
    if (_id) {
      this.id = _id.toHexString();
    }

    return this;
  },

  validateData(name, number) {
    if (!isValidName(name) || !isValidNumber(number)) {
      const err = new Error('name or number is invalid');
      err.name = 'ValidationError';
      throw err;
    }
  },
};

export default Person;
