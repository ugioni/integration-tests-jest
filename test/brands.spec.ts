import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Toolshop API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.practicesoftwaretesting.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Brands', () => {
    it('New Brand', async () => {
      await p
        .spec()
        .post(`${baseUrl}/brands`)
        .withJson({
          name: faker.company.name(),
          slug: faker.person.firstName()
        })
        .expectStatus(StatusCodes.CREATED)
        .returns('deck_id');
    });
  });
});
