import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';

describe('Rick and Morty API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://rickandmortyapi.com/api';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Character', () => {
    it('GET ALL', async () => {
      await p.spec().get(`${baseUrl}/character`).expectStatus(200);
    });

    it('GET Rick', async () => {
      await p.spec().get(`${baseUrl}/character/1`).expectStatus(200);
    });

    it('GET Rick response time', async () => {
      await p.spec().get(`${baseUrl}/character/1`).expectResponseTime(200);
    });

    it('GET xxx', async () => {
      await p
        .spec()
        .get(`${baseUrl}/character/xxx`)
        .expectStatus(500)
        .expectBodyContains('Hey! you must provide an id');
    });
  });
});
