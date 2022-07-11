import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';

describe('Status code validation', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'http://httpbin.org';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Verifying status code from endpoints', () => {
    it('Should be a bad request', async () => {
      await p.spec().get(`${baseUrl}/status/400`).expectStatus(400);
    });

    it('Should be a not found', async () => {
      await p.spec().get(`${baseUrl}/status/200`).expectStatus(200);
    });
  });

  describe('Verifying status code from endpoints using another scope', () => {
    it('Should be a teapot', async () => {
      await p
        .spec()
        .get(`${baseUrl}/status/418`)
        .expectStatus(418)
        .expectBodyContains('teapot');
    });
  });
});
