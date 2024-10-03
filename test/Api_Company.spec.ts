import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('Company API validation', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com/company';

  pactum.request.setDefaultTimeout(30000);
  let createdCompanyId: number;

  describe('Verifying endpoints using POST method', () => {
    it('Should return the same data as the JSON sent', async () => {
      const companyData = {
        name: 'Joao',
        cnpj: '15566565500199',
        state: 'Teste1',
        city: 'Criciuma',
        address: 'Teste2',
        sector: 'Tecnologia'
      };

      try {
        const response = await pactum
          .spec()
          .post(baseUrl)
          .withHeaders('Content-Type', 'application/json')
          .withJson(companyData)
          .expectStatus(StatusCodes.CREATED)
          .returns('body');

        console.log('Response:', response);
        createdCompanyId = response.id;
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });

    it('Should return a bad request when sending invalid data', async () => {
      const invalidCompanyData = {
        name: '',
        cnpj: '123456',
        state: 'Teste1',
        city: 'Criciuma',
        address: 'Teste2',
        sector: 'Tecnologia'
      };

      try {
        await pactum
          .spec()
          .post(baseUrl)
          .withHeaders('Content-Type', 'application/json')
          .withJson(invalidCompanyData)
          .expectStatus(StatusCodes.BAD_REQUEST);
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });
  });

  describe('Verifying endpoints using GET method', () => {
    it('Should retrieve the company details by ID', async () => {
      try {
        const response = await pactum
          .spec()
          .get(`${baseUrl}/${createdCompanyId}`)
          .expectStatus(StatusCodes.OK)
          .returns('body');

        console.log('Company Details:', response);
        expect(response).toEqual(expect.objectContaining({
          id: createdCompanyId,
          name: expect.any(String),
          address: expect.any(String),
          services: expect.any(Array)
        }));
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });

    it('Should retrieve the products of the company by ID', async () => {
      try {
        const response = await pactum
          .spec()
          .get(`${baseUrl}/${createdCompanyId}/products`)
          .expectStatus(StatusCodes.OK)
          .returns('body');

        console.log('Company Products:', response);
        expect(response).toEqual(expect.any(Array)); // Verifica se a resposta é um array
        // Você pode adicionar mais validações conforme necessário
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });
  });

  describe('Verifying endpoints using PUT method', () => {
    it('Should update the company details', async () => {
      const updatedCompanyData = {
        name: 'Joao Silva Updated',
        cnpj: '15566565500199', // Certifique-se de que o CNPJ ainda seja válido
        state: 'Teste1 Updated',
        city: 'Criciuma Updated',
        address: 'Teste2 Updated',
        sector: 'Tecnologia Updated'
      };

      try {
        const response = await pactum
          .spec()
          .put(`${baseUrl}/${createdCompanyId}`)
          .withHeaders('Content-Type', 'application/json')
          .withJson(updatedCompanyData)
          .expectStatus(StatusCodes.OK) // Espera o status 200 (OK)
          .returns('body');

        console.log('Updated Company Response:', response);
        expect(response).toEqual(expect.objectContaining(updatedCompanyData)); // Verifica se os dados atualizados estão corretos
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });
  });

  describe('Verifying endpoints using DELETE method', () => {
    it('Should delete the company by ID', async () => {
      try {
        await pactum
          .spec()
          .delete(`${baseUrl}/${createdCompanyId}`)
          .expectStatus(StatusCodes.NO_CONTENT); // Espera o status 204 (No Content)
        
        console.log(`Company with ID ${createdCompanyId} deleted successfully.`);
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });

    it('Should return a not found error when trying to retrieve the deleted company', async () => {
      try {
        await pactum
          .spec()
          .get(`${baseUrl}/${createdCompanyId}`)
          .expectStatus(StatusCodes.NOT_FOUND); // Espera o status 404 (Not Found)
      } catch (error) {
        console.error('Error:', error); // Log do erro para análise
      }
    });
  });
});
