require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');
const { sendMessage } = require('../messageBroker').Producer;

const target = 'http://localhost:9000';

(async () => {
  const cTodoInChannel = 'req.create.todo';
  const dTodoInChannel = 'req.delete.todo';

  const todosName = ['Kiki', 'Raja', 'Andre', 'Bogang', 'Dandi'];
  const todosId = [];

  describe('Functional Test', () => {
    describe('Sending data to req.create.todo channel', () => {
      it('it should return 5 object data contains id, name, and created fields', async () => {
        // SEND MESSAGE to req.create.todo
        const result = todosName.map(async (m) => {
          const todo = { name: m };
          await sendMessage(cTodoInChannel, todo);
          return todo;
        });
        const data = await Promise.all(result);
        expect(data).to.be.an('array');
        expect(data).to.have.length(todosName.length);
        data.forEach((todo) => {
          expect(todo).to.have.ownProperty('name');
          expect(todo.name).to.be.an('string');
        });
        setTimeout(() => console.log('Waiting for 3 second...', 3000));
      });
    });
    describe('Checking data from todo database', () => {
      it('it should return 200 status code, correct header, correct property and returing 5 todo data', async () => {
        const res = await request(target).get('/todo-items');

        expect(res.status).to.eql(200);
        expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.ownProperty('status');
        expect(res.body).to.have.ownProperty('data');
        expect(res.body.status).to.be.an('string');

        const { data } = res.body;
        expect(data).to.be.an('array');
        expect(data).to.lengthOf(todosName.length);

        data.forEach((todo) => {
          expect(todo).to.have.ownProperty('id');
          expect(todo).to.have.ownProperty('name');
          expect(todo).to.have.ownProperty('created');
          expect(todo.id).to.be.an('string');
          expect(todo.name).to.be.an('string');
          expect(todo.created).to.be.an('number');

          if (data.indexOf(todo) % 2 === 1) {
            todosId.push(todo.id);
          }
        });
      });
    });
    describe('Sending data req.delete.todo channel', () => {
      it('it should return some object data contains id field', async () => {
        // SEND MESSAGE to req.delete.todo
        const result = todosId.map(async (m) => {
          const id = { id: m };
          await sendMessage(dTodoInChannel, id);
          return id;
        });
        const data = await Promise.all(result);
        expect(data).to.be.an('array');
        expect(data).to.lengthOf(todosId.length);
        data.forEach((todo) => {
          expect(todo).to.have.ownProperty('id');
          expect(todo.id).to.be.an('string');
        });
        setTimeout(() => console.log('Waiting for 3 second...', 3000));
      });
    });
    describe('Checking data from database', async () => {
      it('it should return 200 status code, correct header, correct property and returing 5 todo data', async () => {
        const res = await request(target).get('/todo-items');

        expect(res.status).to.eql(200);
        expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.ownProperty('status');
        expect(res.body).to.have.ownProperty('data');
        expect(res.body.status).to.be.an('string');

        const { data } = res.body;
        expect(data).to.be.an('array');
        expect(data).to.lengthOf(todosName.length - todosId.length);

        data.forEach((todo) => {
          expect(todo).to.have.ownProperty('id');
          expect(todo).to.have.ownProperty('name');
          expect(todo).to.have.ownProperty('created');
          expect(todo.id).to.be.an('string');
          expect(todo.name).to.be.an('string');
          expect(todo.created).to.be.an('number');
        });
      });
    });
  });
})();
