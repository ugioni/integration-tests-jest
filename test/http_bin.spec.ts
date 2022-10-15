import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Echo validation', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'http://httpbin.org';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Verifying endpoints using POST method', () => {
    it('Should return the same data as the json sent', async () => {
      await p
        .spec()
        .post(`${baseUrl}/anything`)
        .withJson({
          id: 1,
          status: 'SUCCESS'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          json: {
            id: 1,
            status: 'SUCCESS'
          },
          method: 'POST'
        });
    });

    it('Should not return the same data as the form sent', async () => {
      await p
        .spec()
        .post(`${baseUrl}/anything`)
        .withForm({
          id: '1',
          status: 'FAIL'
        })
        .expectStatus(200)
        .expectJsonLike({
          form: {
            id: '1',
            status: 'FAIL'
          },
          method: 'POST'
        });
    });
  });

  describe('Verifying endpoints using GET method', () => {
    it('Should return only the default data', async () => {
      await p
        .spec()
        .get(`${baseUrl}/anything`)
        .expectStatus(200)
        .expectJsonLike({
          args: {},
          method: 'GET'
        });
    });
  });

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
