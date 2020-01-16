import '@babel/polyfill';
import 'source-map-support/register';

import { Server } from '@soundworks/core/server';
import getConfig from './utils/getConfig';
import path from 'path';
import serveStatic from 'serve-static';
import compile from 'template-literal';

// import services
import PlayerExperience from './PlayerExperience';
import ControllerExperience from './ControllerExperience';

// test another client server-side
import ClientStateManager from '../../../../common/ClientStateManager';
import EventEmitter from 'events';

import assert from 'assert';

const ENV = process.env.ENV || 'default';
const config = getConfig(ENV);

console.log(`
--------------------------------------------------------
- running "${config.app.name}" in "${ENV}" environment -
--------------------------------------------------------
`);

(async function launch() {
  try {
    const server = new Server();

    console.log('---------------------------------------');
    console.log('STATE MANAGER TESTING');
    console.log('---------------------------------------');

    // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------

    await server.init(config, (clientType, config, httpRequest) => {
      return {
        clientType: clientType,
        app: {
          name: config.app.name,
          author: config.app.author,
        },
        env: {
          type: config.env.type,
          websockets: config.env.websockets,
          assetsDomain: config.env.assetsDomain,
        }
      };
    });

    // register schemas and init shared states

    const schemaA = {
      bool: {
        type: 'boolean',
        default: false,
      },
      int: {
        type: 'integer',
        min: 0,
        max: 100,
        default: 50,
        step: 1,
      },
      event: {
        type: 'boolean',
        event: true,
      }
    };

    const schemaB = {
      bool: {
        type: 'boolean',
        default: true,
      },
      int: {
        type: 'integer',
        min: 0,
        max: 100,
        default: 20,
        step: 1,
      },
    }

    server.stateManager.registerSchema('schemaA', schemaA);
    server.stateManager.registerSchema('schemaB', schemaB);

    // html template and static files (in most case, this should not be modified)
    server.configureHtmlTemplates({ compile }, path.join('.build', 'server', 'tmpl'))
    server.router.use(serveStatic('public'));
    server.router.use('build', serveStatic(path.join('.build', 'public')));

    const playerExperience = new PlayerExperience(server, 'player');
    const controllerExperience = new ControllerExperience(server, 'controller');

    await server.start();
    playerExperience.start();
    controllerExperience.start();

    console.log('\n> create states');
    const stateA = await server.stateManager.create('schemaA');
    const stateB = await server.stateManager.create('schemaB');
    console.log('stateA.id', stateA.id, 'stateA.remoteId', stateA.remoteId);
    console.log('stateB.id', stateB.id, 'stateB.remoteId', stateB.remoteId);

    console.log('\n> create state w/ init values:', { bool: true, int: 42, });
    const stateA_I = await server.stateManager.create('schemaA', {
      bool: true,
      int: 42,
    });
    console.log(stateA_I.getValues());

    console.log('\n> create several states of same kind');
    const stateA_C1 = await server.stateManager.create('schemaA');
    const stateA_C2 = await server.stateManager.create('schemaA');
    console.log('stateA_C1.id', stateA_C1.id);
    console.log('stateA_C2.id', stateA_C2.id);

    console.log(`\n> update values of a state`);
    stateA.subscribe(updates => console.log('stateA::subscribe', updates));
    const result = await stateA.set({ bool: true });
    console.log('stateA::set result', result);

    console.log('\n> setting same value twice does not propagate if not parameter[event=true]');
    await stateA.set({ bool: false }); //
    await stateA.set({ bool: false });
    await stateA.set({ event: true });
    await stateA.set({ event: true });

    console.log(`\n> check that states of same kind don't collide`);
    stateA_C1.subscribe(updates => console.log('stateA_C1::subscribe', updates));
    stateA_C2.subscribe(updates => console.log('stateA_C2::subscribe', updates));

    await stateA.set({ bool: false });
    console.log('stateA', stateA.getValues());
    console.log('stateA_C1', stateA_C1.getValues());
    console.log('stateA_C2', stateA_C2.getValues());

    await stateA_C1.set({ int: 27 });
    console.log('stateA', stateA.getValues());
    console.log('stateA_C1', stateA_C1.getValues());
    console.log('stateA_C2', stateA_C2.getValues());

    console.log('\n> attach to a state');

    const stateA_A1 = await server.stateManager.attach('schemaA', stateA.id);
    stateA_A1.subscribe(updates => console.log('stateA_A1::subscribe', updates));
    stateA.set({ bool: true });
    stateA.set({ bool: true });
    stateA.set({ int: 42 });
    console.log('stateA', stateA.getValues());
    console.log('stateA_A1', stateA_A1.getValues());

    stateA_A1.set({ bool: false });
    console.log('stateA', stateA.getValues());
    console.log('stateA_A1', stateA_A1.getValues());

    console.log('\n> multiple attach');
    const stateA_A2 = await server.stateManager.attach('schemaA', stateA.id);
    console.log('>> await stateA_A2.set({ int: 90 })');
    await stateA_A2.set({ int: 90 });
    console.log('stateA', stateA.getValues());
    console.log('stateA_A1', stateA_A1.getValues());
    console.log('stateA_A2', stateA_A2.getValues());

    console.log('\n> detach state');

    stateA_A1.onDetach(() => console.log('stateA_A1::onDetach called'));
    await stateA_A1.detach();
    stateA.set({ int: 27 });
    console.log('stateA', stateA.getValues());
    console.log('stateA_A1', stateA_A1.getValues());
    console.log('stateA_A2', stateA_A2.getValues());

    console.log('\n> delete state, attached state should be notified');

    stateA_A2.onDetach(() => console.log('stateA_A2::onDetach called'));
    stateA_A2.onDelete(() => console.log('stateA_A2::onDelete called'));
    await stateA.detach();


    console.log('\n> delete schema when state attached');
    server.stateManager.registerSchema('schemaB_D', schemaB);
    const stateB_D1 = await server.stateManager.create('schemaB_D');
    const stateB_D2 = await server.stateManager.attach('schemaB_D', stateB_D1.id);

    stateB_D1.onDetach(() => console.log('stateB_D1::onDetach called'));
    stateB_D1.onDelete(() => console.log('stateB_D1::onDelete called'));
    stateB_D2.onDetach(() => console.log('stateB_D2::onDetach called'));
    stateB_D2.onDelete(() => console.log('stateB_D2::onDelete called'));

    const stateB_D4 = await server.stateManager.create('schemaB_D');
    const stateB_D5 = await server.stateManager.attach('schemaB_D', stateB_D4.id);

    stateB_D4.onDetach(() => console.log('stateB_D4::onDetach called'));
    stateB_D4.onDelete(() => console.log('stateB_D4::onDelete called'));
    stateB_D5.onDetach(() => console.log('stateB_D5::onDetach called'));
    stateB_D5.onDelete(() => console.log('stateB_D5::onDelete called'));

    await stateB_D1.set({ int: 12 });
    console.log('stateB_D1', stateB_D1.getValues());
    console.log('stateB_D2', stateB_D2.getValues());

    await stateB_D5.set({ int: 42 });
    console.log('stateB_D4', stateB_D4.getValues());
    console.log('stateB_D5', stateB_D5.getValues());

    server.stateManager.deleteSchema('schemaB_D');

    console.log('\n> create deleted or unexisting schema');
    try {
      const stateB_U1 = await server.stateManager.create('schemaB_D'); // deleted
      const stateB_U2 = await server.stateManager.create('schemaB_U'); // does not exists
    } catch(err) {
      console.log(err);
    }

    console.log('\n> observe after some states have been created');

    await server.stateManager.observe((schemaName, schemaId, nodeId) => {
      if (schemaName !== 'player' && schemaName !== 'global') {
        console.log('observed created state:', schemaName, schemaId, nodeId);
      }
    });

    console.log('\n> observe states created now');

    const stateB_O1 = await server.stateManager.create('schemaB');
    const stateB_O2 = await server.stateManager.create('schemaB');
    const stateB_O3 = await server.stateManager.create('schemaB');


    console.log('\n> addClient, create and attach state');

    const otherClientId = -2;
    const otherClientTransport = new EventEmitter();

    const clientStateManager = new ClientStateManager(otherClientId, otherClientTransport);
    server.stateManager.addClient(otherClientId, otherClientTransport);

    const stateB_OC1 = await clientStateManager.create('schemaB', { bool: true, int: 11 });
    console.log('stateB_OC1', stateB_OC1.getValues());

    const stateB_OC2 = await server.stateManager.attach('schemaB', stateB_OC1.id);
    console.log('stateB_OC2', stateB_OC2.getValues());

    await stateB_OC1.set({ bool: false });
    console.log('stateB_OC1', stateB_OC1.getValues());
    console.log('stateB_OC2', stateB_OC2.getValues());

    await stateB_OC2.set({ int: 24 });
    console.log('stateB_OC1', stateB_OC1.getValues());
    console.log('stateB_OC2', stateB_OC2.getValues());


    console.log('\n> removeClient');

    stateB_OC1.onDetach(() => console.log('stateB_OC1::onDetach called (but SHOULD NOT be called)'));
    stateB_OC1.onDelete(() => console.log('stateB_OC1::onDelete called (but SHOULD NOT be called)'));

    // only B_OC
    stateB_OC2.onDetach(() => console.log('stateB_OC2::onDetach called'));
    stateB_OC2.onDelete(() => console.log('stateB_OC2::onDelete called'));

    server.stateManager.removeClient(otherClientId);

    console.log('\n> clean a deleted state from server (should not appear in observe)');

    const stateA_D1 = await server.stateManager.create('schemaA');
    const stateA_D1_Id = stateA_D1.id;
    stateA_D1.detach();

    server.stateManager.observe((schemaName, stateId, nodeId) => {
      if (stateId === stateA_D1_Id) {
        throw new Error(`stateA_D1 with stateId ${stateA_D1_Id} has been delete and should not be observed`);
      }
    });

    console.log('\n> client-side & socket transport');

    const playerSchema = {
      id: {
        type: 'integer',
        default: null,
        nullable: true,
      },
      rand: {
        type: 'float',
        default: null,
        nullable: true,
      },
    };

    const globalSchema = {
      float: {
        type: 'float',
        default: 0,
        min: 0,
        max: 1,
        step: 0.001,
      },
    };

    server.stateManager.registerSchema('player', playerSchema);
    server.stateManager.registerSchema('global', globalSchema);

    const globalState = await server.stateManager.create('global');
    console.log('globalState', globalState.getValues());

    console.log('> http://127.0.0.1:8000/controller')
    console.log('> http://127.0.0.1:8000/?emulate=10')
  } catch (err) {
    console.error(err.stack);
  }
})();

process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});

















