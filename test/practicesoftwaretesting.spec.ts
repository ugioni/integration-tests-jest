import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('practice software testing', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.practicesoftwaretesting.com';

  const email = faker.internet.email();
  const senha = faker.internet.password({ length: 10, prefix: 'Aa@1' });

  let token = '';
  let brandId = '';

  p.request.setDefaultTimeout(60000);

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

  describe('Brands', () => {
    it('Cadastrar nova Brand', async () => {
      brandId = await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .post(`${baseUrl}/brands`)
        .withJson({
          name: faker.number.int() + '',
          slug: faker.number.int() + ''
        })
        .expectStatus(StatusCodes.CREATED)
        .returns('id');
    });

    it('Brand não processada', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .post(`${baseUrl}/brands`)
        .withJson({
          name: '@',
          slug: '#'
        })
        .expectStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('Editar nova Brand', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .put(`${baseUrl}/brands/${brandId}`)
        .withJson({
          name: faker.number.int() + 'editado',
          slug: faker.number.int() + 'editado'
        })
        .expectStatus(StatusCodes.OK);
    });

    it('buscar nova Brand editada', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .get(`${baseUrl}/brands/${brandId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('buscar Brand editada pelo search', async () => {
      await p
        .spec()
        .withHeaders({ Authorization: `Bearer ${token}` })
        .get(`${baseUrl}/brands/search`)
        .withQueryParams({
          q: 'editado'
        })
        .expectStatus(StatusCodes.OK);
    });
  });
});
