import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';

describe('ServeRest API', () => {
  let token = '';
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://serverest.dev';

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Login', () => {
    it('POST', async () => {
      token = await p
        .spec()
        .post(`${baseUrl}/login`)
        .withJson({
          email: 'a@b.com.br',
          password: 'admin.1234'
        })
        .expectStatus(200)
        .returns('authorization');
    });
  });

  describe('Usuários', () => {
    it('GET ALL', async () => {
      await p
        .spec()
        .get(`${baseUrl}/usuarios`)
        .withHeaders('Authorization', token)
        .expectStatus(200);
    });
  });
});
