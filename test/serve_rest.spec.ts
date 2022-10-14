import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('ServeRest API', () => {
  let token = '';
  let idUsuario = '';
  let idProduto = '';
  let emailUsuario = '';
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://serverest.dev';

  beforeAll(async () => {
    p.reporter.add(rep);

    idUsuario = await p
      .spec()
      .post(`${baseUrl}/usuarios`)
      .withRequestTimeout(60000)
      .withHeaders('monitor', false)
      .withJson({
        nome: faker.internet.userName(),
        email: faker.internet.email(),
        password: '123456789',
        administrador: 'true'
      })
      .expectStatus(201)
      .returns('_id');

    emailUsuario = await p
      .spec()
      .get(`${baseUrl}/usuarios/${idUsuario}`)
      .withRequestTimeout(60000)
      .withHeaders('monitor', false)
      .expectStatus(200)
      .returns('email');
  });

  beforeEach(async () => {
    token = await p
      .spec()
      .post(`${baseUrl}/login`)
      .withRequestTimeout(60000)
      .withHeaders('monitor', false)
      .withJson({
        email: `${emailUsuario}`,
        password: '123456789'
      })
      .expectStatus(200)
      .returns('authorization');
  });

  describe('Produtos', () => {
    it('Cadastro um novo produto', async () => {
      idProduto = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withRequestTimeout(60000)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          nome: faker.commerce.productName(),
          preco: 500,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(201)
        .returns('_id');
    });
    it('Busca o novo produto cadastrado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/produtos/${idProduto}`)
        .withRequestTimeout(60000)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .expectStatus(200);
    });
  });

  describe('Carrinhos', () => {
    it('Adiciona um novo carrinho', async () => {
      await p
        .spec()
        .post(`${baseUrl}/carrinhos`)
        .withRequestTimeout(60000)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          produtos: [
            {
              idProduto: `${idProduto}`,
              quantidade: 10
            }
          ]
        })
        .expectStatus(201)
        .returns('_id');
    });
    it('Conclui a compra e exclui o carrinho', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/carrinhos/concluir-compra`)
        .withRequestTimeout(60000)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .expectStatus(200);
    });
  });

  afterAll(() => p.reporter.end());
});
