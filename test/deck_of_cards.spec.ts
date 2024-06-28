import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import data from '../data/data.json';

describe.skip('Deck of cards', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe.skip('Verifying endpoints using POST method', () => {
    it('Should return the same data as the json sent', async () => {
      await p
        .spec()
        .post(`${baseUrl}/anything`)
        .withJson(data.sucesso)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          json: {
            id: 1,
            status: 'SUCCESS'
          },
          method: 'POST'
        });
    });
  });
});
