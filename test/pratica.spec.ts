import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Aula Pratica 01', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.practicesoftwaretesting.com';
  const email = faker.internet.email();
  const senha = faker.internet.password({ length: 10, prefix: 'Aa@1' });

  let token = '';

  p.request.setDefaultTimeout(120000);

  beforeAll(async () => {
    p.reporter.add(rep);

    await p
      .spec()
      .post(`${baseUrl}/users/register`)
      .withJson({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        address: {
          street: 'Street 1',
          city: 'City',
          state: 'State',
          country: 'Country',
          postal_code: '1234AA'
        },
        phone: '0987654321',
        dob: '1970-01-01',
        password: senha,
        email: email
      })
      .expectStatus(StatusCodes.CREATED);
  });

  afterAll(() => p.reporter.end());

  beforeEach(async () => {
    token = await p
      .spec()
      .post(`${baseUrl}/users/login`)
      .withJson({
        email: email,
        password: senha
      })
      .expectStatus(StatusCodes.OK)
      .returns('access_token');
  });

  describe('Invoices', () => {
    it('Invoice Not Found', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .post(`${baseUrl}/invoices`)
        .withJson({
          billing_street: faker.location.streetAddress(),
          billing_city: faker.location.city(),
          billing_state: faker.location.state(),
          billing_country: faker.location.country(),
          billing_postal_code: faker.location.zipCode(),
          payment_method: 'bank-transfer',
          cart_id: faker.finance.creditCardNumber(),
          payment_details: {
            bank_name: faker.company.name(),
            account_name: faker.finance.accountName(),
            account_number: faker.finance.accountNumber()
          }
        })
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    it('Invoice metodo não permitido', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .delete(`${baseUrl}/invoices`)
        .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
    });

    it('Invoice metodo não permitido', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .post(`${baseUrl}/invoices`)
        .withJson({
          billing_street: faker.location.streetAddress(),
          billing_city: faker.location.city(),
          billing_state: faker.location.state(),
          billing_country: faker.location.country(),
          billing_postal_code: faker.location.zipCode()
        })
        .expectStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });
});
