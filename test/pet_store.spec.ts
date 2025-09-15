import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Pet Store API', () => {
  const password = faker.string.numeric(9);
  const userName = faker.internet.username();
  const dogName = faker.animal.dog();
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://petstore.swagger.io/v2';

  p.request.setDefaultTimeout(90000);

  beforeAll(async () => {
    p.reporter.add(rep);
    await p
      .spec()
      .post(`${baseUrl}/user`)
      .withJson({
        username: userName,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: password,
        phone: faker.phone.number(),
        userStatus: 0
      })
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('200');
  });

  beforeEach(async () => {
    await p
      .spec()
      .get(`${baseUrl}/user/login`)
      .withJson({
        username: userName,
        password: password
      })
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('logged in user session:');
  });

  describe('Pet - Everything about your Pets', () => {
    it('cadastro do PET', async () => {
      await p
        .spec()
        .post(`${baseUrl}/pet`)
        .withJson({
          category: {
            id: faker.number.int(32),
            name: faker.word.words(3)
          },
          name: dogName,
          photoUrls: ['string'],
          tags: [
            {
              id: 0,
              name: 'string'
            }
          ],
          status: 'available'
        })
        .expectStatus(StatusCodes.OK)
        .expectBodyContains(dogName)
        .returns('id');
    });

    it('atualizar dados do PET', async () => {
      await p
        .spec()
        .put(`${baseUrl}/pet`)
        .withJson({
          category: {
            id: faker.number.int(32),
            name: faker.word.words(3)
          },
          name: 'Cachorrinho do Guichard',
          photoUrls: ['string'],
          tags: [
            {
              id: 0,
              name: 'string'
            }
          ],
          status: 'available'
        })
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('Cachorrinho do Guichard')
        .expectResponseTime(5000);
    });
  });

  describe('Store - Access to Petstore orders', () => {
    it('cadastro do Order', async () => {
      await p
        .spec()
        .post(`${baseUrl}/store/order`)
        .withJson({
          petId: 1,
          quantity: 0,
          shipDate: '2023-11-13T23:29:01.646Z',
          status: 'placed',
          complete: true
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            petId: {
              type: 'integer'
            },
            quantity: {
              type: 'integer'
            },
            shipDate: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            complete: {
              type: 'boolean'
            }
          },
          required: [
            'id',
            'petId',
            'quantity',
            'shipDate',
            'status',
            'complete'
          ]
        });
    });

    it('get do Inventory', async () => {
      await p
        .spec()
        .get(`${baseUrl}/store/inventory`)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains(`sold`)
        .expectHeaderContains('content-type', 'application/json');
    });
  });

  afterAll(() => p.reporter.end());
});
