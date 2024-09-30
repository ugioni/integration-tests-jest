import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Deck of cards', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://deckofcardsapi.com/api';
  let deckId = '';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('DECK', () => {
    it('New Deck', async () => {
      deckId = await p
        .spec()
        .post(`${baseUrl}/deck/new/`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            deck_id: {
              type: 'string'
            },
            remaining: {
              type: 'integer'
            },
            shuffled: {
              type: 'boolean'
            }
          },
          required: ['success', 'deck_id', 'remaining', 'shuffled']
        })
        .returns('deck_id');
    });

    it('Shuffle Deck', async () => {
      await p
        .spec()
        .post(`${baseUrl}/deck/${deckId}/shuffle/`)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('52')
        .expectJsonLike({ shuffled: true });
    });
  });
});
