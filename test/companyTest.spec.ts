const pactum = require('pactum');
const { StatusCodes } = require('http-status-codes');

const baseUrl = 'https://api-desafio-qa.onrender.com/company';  // URL corrigida

const data = {
  sucesso: {
    name: "Empresa Exemplo",
    cnpj: "12.345.678/0001-90",
    state: "SP",
    city: "São Paulo",
    address: "Rua Exemplo, 123",
    sector: "Tecnologia"
  },
  erroCnpj: {
    name: "Empresa Inválida",
    cnpj: "1234567890",  // CNPJ inválido
    state: "RJ",
    city: "Rio de Janeiro",
    address: "Avenida Brasil, 456",
    sector: "Construção"
  },
  semNome: {
    cnpj: "12.345.678/0001-90",
    state: "SP",
    city: "São Paulo",
    address: "Rua Exemplo, 123",
    sector: "Tecnologia"
  }
};

describe('Testes da API de Criação de Empresa', () => {
  
  // Cenário 1: Criar empresa com dados válidos
  it('Deve criar uma empresa com dados válidos', async () => {
    const response = await pactum
      .spec()
      .post(`${baseUrl}`)
      .withJson(data.sucesso)
      .expectStatus(StatusCodes.CREATED)  // Verifica se o status é 201, ajuste se necessário após verificar logs
      .inspect()  // Adiciona logs da resposta
      .expectJsonLike({
        message: 'Empresa criada com sucesso',
        company: {
          name: data.sucesso.name,
          cnpj: data.sucesso.cnpj,
          state: data.sucesso.state,
          city: data.sucesso.city,
          address: data.sucesso.address,
          sector: data.sucesso.sector
        }
      });

    // Validar se o ID está presente na resposta
    expect(response.body.company).toHaveProperty('id');
    console.log('Empresa criada com ID:', response.body.company.id);
  });

  // Cenário 2: CNPJ inválido
  it('Deve retornar erro ao enviar CNPJ inválido', async () => {
    const response = await pactum
      .spec()
      .post(`${baseUrl}`)
      .withJson(data.erroCnpj)
      .expectStatus(StatusCodes.BAD_REQUEST)  // Verifica se o status é 400 (erro de validação)
      .inspect()  // Logs da resposta
      .expectJsonLike({
        message: 'CNPJ inválido'
      });
      
    // Verifica se o campo message existe
    expect(response.body).toHaveProperty('message');
  });

  // Cenário 3: Falta de nome
  it('Deve retornar erro ao enviar uma empresa sem nome', async () => {
    const response = await pactum
      .spec()
      .post(`${baseUrl}`)
      .withJson(data.semNome)
      .expectStatus(StatusCodes.BAD_REQUEST)  // Verifica se o status é 400
      .inspect()  // Logs da resposta
      .expectJsonLike({
        message: "O campo 'name' é obrigatório"
      });

    // Verifica se o campo message existe
    expect(response.body).toHaveProperty('message');
  });

});
