import { V3MockServer } from '@pact-foundation/pact';
import { eachLike } from '@pact-foundation/pact/src/v3/matchers';
import * as supertest from 'supertest';
import { pactWith } from './index';

const getClient = (mock: V3MockServer) => supertest(mock.url);

const EXISTING_EVENT_DATA = {
  name: 'test event 1',
  id: '1cb9eb9e',
  teamId: 'dummy_tid',
};

pactWith({ consumer: 'MyConsumer', provider: 'pactWith v3' }, (interaction) => {
  interaction('pact integration', ({ provider, execute }) => {
    beforeEach(() =>
      provider
        .given('A pet 1845563262948980200 exists')
        .uponReceiving('A get request to get a pet 1845563262948980200')
        .withRequest({
          method: 'GET',
          path: '/v2/pet/1845563262948980200',
          headers: { api_key: '[]' },
        })
        .willRespondWith({
          status: 200,
          body: {
            items: eachLike(EXISTING_EVENT_DATA),
          },
        })
    );

    execute('A pact test that returns 200', (mock) =>
      getClient(mock)
        .get('/v2/pet/1845563262948980200')
        .set('api_key', '[]')
        .expect(200)
    );
  });

  interaction('another pact integration', ({ provider, execute }) => {
    beforeEach(() =>
      provider
        .given('No pets exist')
        .uponReceiving('A get request to get a pet 1845563262948980200')
        .withRequest({
          method: 'GET',
          path: '/v2/pet/1845563262948980200',
          headers: { api_key: '[]' },
        })
        .willRespondWith({
          status: 404,
        })
    );

    execute('A pact test that returns 404', (mock) =>
      getClient(mock)
        .get('/v2/pet/1845563262948980200')
        .set('api_key', '[]')
        .expect(404)
    );
  });
});
