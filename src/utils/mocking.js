import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateMockUser = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10), 
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: []
});

export const generateMockPet = () => ({
    name: faker.animal.cat(), // o faker.animal.dog()
    specie: faker.helpers.arrayElement(["dog", "cat"]),
    birthDate: faker.date.past(),
    adopted: false,
    owner: null
});
