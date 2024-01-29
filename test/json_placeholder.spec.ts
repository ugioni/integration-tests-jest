import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Json Placeholder', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('POSTS', () => {
    it('criar um novo post', async () => {
      await p
        .spec()
        .post(`${baseUrl}/posts`)
        .withJson({
          userId: 1,
          title: 'bootcamp api',
          body: 'criando novos testes de api'
        })
        .expectStatus(StatusCodes.CREATED);
    });
  });

  describe('ALBUMS', () => {
    it('criar um novo album', async () => {
      await p
        .spec()
        .post(`${baseUrl}/albums`)
        .withJson({
          userId: 1,
          title: 'album do bootcamp'
        })
        .expectStatus(StatusCodes.CREATED);
    });
  });
});
