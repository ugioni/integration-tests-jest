import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('ServeRest API', () => {
  let token = '';
  let id = '';
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
          email: 'fulano@qa.com',
          password: 'teste'
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

  describe('produtos', () => {
    it('post', async () => {
      id = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withJson({
          nome: faker.commerce.product(),
          preco: 1000,
          descricao: 'notebook',
          quantidade: 1
        })
        .expectStatus(201)
        .expectBodyContains('Cadastro realizado com sucesso')
        .returns('_id');
    });

    it('GET produto', async () => {
      await p
        .spec()
        .get(`${baseUrl}/produtos/${id}`)
        .withHeaders('Authorization', token)
        .expectStatus(200);
    });
  });
});
