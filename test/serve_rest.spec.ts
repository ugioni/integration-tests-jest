import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('ServeRest API', () => {
  let token = '';
  let idUsuario = '';
  let idProduto = '';
  let idProduto2 = '';
  let emailUsuario = '';
  const descProdutoDuplicado = faker.commerce.productName();
  const password = faker.string.numeric(9);
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://serverest.dev';

  p.request.setDefaultTimeout(90000);

  beforeAll(async () => {
    p.reporter.add(rep);

    idUsuario = await p
      .spec()
      .post(`${baseUrl}/usuarios`)
      .withHeaders('monitor', false)
      .withJson({
        nome: faker.internet.username(),
        email: faker.internet.email(),
        password: password,
        administrador: 'true'
      })
      .expectStatus(StatusCodes.CREATED)
      .expectBodyContains('Cadastro realizado com sucesso')
      .returns('_id');

    emailUsuario = await p
      .spec()
      .get(`${baseUrl}/usuarios/${idUsuario}`)
      .withHeaders('monitor', false)
      .expectStatus(StatusCodes.OK)
      .returns('email');
  });

  beforeEach(async () => {
    token = await p
      .spec()
      .post(`${baseUrl}/login`)
      .withHeaders('monitor', false)
      .withJson({
        email: `${emailUsuario}`,
        password: password
      })
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('Login realizado com sucesso')
      .expectJsonSchema({
        type: 'object'
      })
      .returns('authorization');
  });

  describe('Validações login', () => {
    it('login inválido', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withHeaders('monitor', false)
        .withJson({
          email: faker.internet.email(),
          password: faker.string.numeric(5)
        })
        .expectStatus(StatusCodes.UNAUTHORIZED)
        .expectBodyContains('Email e/ou senha inválidos');
    });
  });

  describe('Produtos', () => {
    it('Cadastro um novo produto', async () => {
      idProduto = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          nome: faker.commerce.productName(),
          preco: 500,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .expectJsonSchema({
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            _id: {
              type: 'string'
            }
          },
          required: ['message', '_id']
        })
        .returns('_id');
    });

    it('Cadastro um novo produto', async () => {
      idProduto2 = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          nome: faker.commerce.productName(),
          preco: 1600,
          descricao: faker.commerce.productDescription(),
          quantidade: 30
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .expectJsonSchema({
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            _id: {
              type: 'string'
            }
          },
          required: ['message', '_id']
        })
        .returns('_id');
    });

    it('Busca o novo produto cadastrado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/produtos/${idProduto}`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.OK);
    });

    it('produto sem token válido', async () => {
      await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('monitor', false)
        .withJson({
          nome: faker.commerce.productName(),
          preco: 500,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(StatusCodes.UNAUTHORIZED)
        .expectBodyContains(
          'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
        );
    });

    it('Validar produtos com descrição duplicada', async () => {
      await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          nome: descProdutoDuplicado,
          preco: 500,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .returns('_id');

      await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          nome: descProdutoDuplicado,
          preco: 500,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Já existe produto com esse nome');
    });
  });

  describe('Carrinhos', () => {
    it('Adiciona um novo carrinho', async () => {
      await p
        .spec()
        .post(`${baseUrl}/carrinhos`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .withJson({
          produtos: [
            {
              idProduto: `${idProduto}`,
              quantidade: 10
            },
            {
              idProduto: `${idProduto2}`,
              quantidade: 12
            }
          ]
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            _id: {
              type: 'string'
            }
          },
          required: ['message', '_id']
        });
    });

    it('carrinho inválido', async () => {
      await p
        .spec()
        .get(`${baseUrl}/carrinhos/qbMtntef8iTOwWfz`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Carrinho não encontrado');
    });

    it('Conclui a compra e exclui o carrinho', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/carrinhos/concluir-compra`)
        .withHeaders('Authorization', token)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('Registro excluído com sucesso');
    });
  });

  afterAll(() => p.reporter.end());
});
