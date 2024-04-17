import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Sistema - ServeRest', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://serverest.dev';

  const email = faker.internet.email();
  const password = faker.internet.password();

  let idUsuario = '';
  let idProduto = '';
  let idProduto2 = '';
  let idProduto3 = '';
  let token = '';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Usuário', () => {
    it('Cadastrar um novo usuário', async () => {
      idUsuario = await p
        .spec()
        .post(`${baseUrl}/usuarios`)
        .withJson({
          nome: faker.person.firstName(),
          email: email,
          password: password,
          administrador: 'true'
        })
        .expectStatus(StatusCodes.CREATED).returns('_id');
    });

    it('Buscar usuário', async () => {
      await p
        .spec()
        .get(`${baseUrl}/usuarios/${idUsuario}`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('Login', () => {
    it('Login válido', async () => {
      token = await p
        .spec()
        .post(`${baseUrl}/login`)
        .withJson({
          email: email,
          password: password
        })
        .expectStatus(StatusCodes.OK).returns('authorization');
    });

    it('Login inválido', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withJson({
          email: 'a@b.com.br',
          password: '123456'
        })
        .expectStatus(StatusCodes.UNAUTHORIZED)
        .expectBodyContains('Email e/ou senha inválidos');
    });
  });

  describe('Produtos', () => {
    it('cadastrar um novo produto', async () => {
      idProduto = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withJson({
          nome: faker.commerce.product() + ' ' + faker.commerce.isbn(13),
          preco: 470,
          descricao: faker.commerce.productDescription(),
          quantidade: 381
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .returns('_id');
    });

    it('cadastrar um novo produto', async () => {
      idProduto2 = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withJson({
          nome: faker.commerce.product() + ' ' + faker.commerce.isbn(13),
          preco: 840,
          descricao: faker.commerce.productDescription(),
          quantidade: 1
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .returns('_id');
    });

    it('cadastrar um novo produto', async () => {
      idProduto3 = await p
        .spec()
        .post(`${baseUrl}/produtos`)
        .withHeaders('Authorization', token)
        .withJson({
          nome: faker.commerce.product() + ' ' + faker.commerce.isbn(13),
          preco: 560,
          descricao: faker.commerce.productDescription(),
          quantidade: 10
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso')
        .returns('_id');
    });

    it('editar o produto 01', async () => {
      await p
        .spec()
        .put(`${baseUrl}/produtos/${idProduto}`)
        .withHeaders('Authorization', token)
        .withJson({
          nome: faker.commerce.product() + ' ' + faker.commerce.isbn(13),
          preco: 1500,
          descricao: faker.commerce.productDescription(),
          quantidade: 2000
        })
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('Registro alterado com sucesso');
    });

    it('validar produto editado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/produtos/${idProduto}`)
        .withHeaders('Authorization', token)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          quantidade: 2000
        });
    });
  });

  describe('Carrinho', () => {
    it('cadastrar um novo carrinho', async () => {
      await p
        .spec()
        .post(`${baseUrl}/carrinhos`)
        .withHeaders('Authorization', token)
        .withJson({
          produtos: [
            {
              idProduto: idProduto,
              quantidade: 5
            },
            {
              idProduto: idProduto3,
              quantidade: 10
            }
          ]
        })
        .expectStatus(StatusCodes.CREATED)
        .expectBodyContains('Cadastro realizado com sucesso');
    });

    it('validar carrinho duplicado', async () => {
      await p
        .spec()
        .post(`${baseUrl}/carrinhos`)
        .withHeaders('Authorization', token)
        .withJson({
          produtos: [
            {
              idProduto: idProduto2,
              quantidade: 1
            }
          ]
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Não é permitido ter mais de 1 carrinho');
    });

    it('concluir compra', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/carrinhos/concluir-compra`)
        .withHeaders('Authorization', token)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('Registro excluído com sucesso');
    });

    it('validar carrinho com produto sem estoque', async () => {
      await p
        .spec()
        .post(`${baseUrl}/carrinhos`)
        .withHeaders('Authorization', token)
        .withJson({
          produtos: [
            {
              idProduto: idProduto2,
              quantidade: 25
            }
          ]
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Produto não possui quantidade suficiente');
    });
  });
});
