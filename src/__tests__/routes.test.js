const request = require('supertest');
const server = require('./../index');

beforeAll(async () => {
	// do something before anything else runs
	console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
	server.close();
	console.log('server closed!');
});
describe('basic route tests', () => {
	test('get home route GET /', async () => {
		const response = await request(server).get('/');
		expect(response.status).toEqual(200);
		expect(response.text).toContain('Hello, welcome to the Polycade API');
	});
});

describe('pricing model route tests', () => {
	test('get all pricing models route GET /pricing-models', async () => {
		const response = await request(server).get('/pricing-models');
		expect(response.status).toEqual(200);
	});
	test('create a pricing model route POST /pricing-models', async () => {
		const response = await request(server)
			.post('/pricing-models')
			.send({
				'name': 'Black Friday Pricing 1',
				'pricing': [
					{
						'price': 12,
						'name': '60 minutes',
						'value': 24
					}
				]
			});
		expect(response.status).toEqual(201);
		expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
	});
	test('get a pricing model by ID route GET /pricing-models/:pricingModelID', async () => {
		const response = await request(server).get('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154');
		expect(response.status).toEqual(200);
	});
	test('get a pricing model by ID route GET /pricing-models/:pricingModelID', async () => {
		const response = await request(server).get('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d15');
		expect(response.status).toEqual(404);
		expect(response.text).toContain('Pricing Model with id 4d40de8f-68f8-4160-a83a-665dbc92d15 not found ');
	});
	test('update a pricing model route PUT /pricing-models/:pricingModelID', async () => {
		const response = await request(server)
			.put('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e')
			.send({
				'name': '10% discount'
			});
		expect(response.status).toEqual(202);
		expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
	});
	test('update a pricing model route PUT /pricing-models/:pricingModelID', async () => {
		const response = await request(server)
			.put('/pricing-models/48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e')
			.send({
				'nme': '10% discount'
			});
		expect(response.status).toEqual(400);
	});
	test('get prices for a pricing model by ID route GET /pricing-models/:pricingModelID/prices', async () => {
		const response = await request(server).get('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154/prices');
		expect(response.status).toEqual(200);
		expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
	});
	test('create a pricing config for a pricing model route POST /pricing-models/:pricingModelID/prices', async () => {
		const response = await request(server)
			.post('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154/prices')
			.send({
				'price': 12,
				'name': '60 minutes',
				'value': 24
			});
		expect(response.status).toEqual(201);
		expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
	});
	test('create a pricing config for a pricing model route POST /pricing-models/:pricingModelID/prices', async () => {
		const response = await request(server)
			.post('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154/prices')
			.send({
				'name': '60 minutes',
				'value': 24
			});
		expect(response.status).toEqual(400);
		expect(response.text).toContain('Found an error: price (int) is missing in your pricing object');
	});
	test('create a pricing config for a pricing model route POST /pricing-models/:pricingModelID/prices', async () => {
		const response = await request(server)
			.post('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154/prices')
			.send({
				'price': 12,
				'value': 24
			});
		expect(response.status).toEqual(400);
		expect(response.text).toContain('Found an error: name (str) is missing in your pricing object');
	});
	test('create a pricing config for a pricing model route POST /pricing-models/:pricingModelID/prices', async () => {
		const response = await request(server)
			.post('/pricing-models/4d40de8f-68f8-4160-a83a-665dbc92d154/prices')
			.send({
				'price': 12,
				'name': '60 minutes'
			});
		expect(response.status).toEqual(400);
		expect(response.text).toContain('Found an error: value (int) is missing in your pricing object');
	});
});

describe('machine route tests', () => {
	test('get a machine by Id GET /machines/:machineID', async () => {
		const response = await request(server).get('/machines/57342663-909c-4adf-9829-6dd1a3aa9143');
		expect(response.status).toEqual(200);
	});
	test('get a machine by Id GET /machines/:machineID', async () => {
		const response = await request(server).get('/machines/57342663-909c-4adf-9829-6dd1a3aa914');
		expect(response.status).toEqual(404);
		expect(response.text).toContain('Machine with id 57342663-909c-4adf-9829-6dd1a3aa914 not found');
	});
	test('get prices for a machine by Id GET /machines/:machineID/prices', async () => {
		const response = await request(server).get('/machines/57342663-909c-4adf-9829-6dd1a3aa9143/prices');
		expect(response.status).toEqual(200);
	});
	test('update machine with pricing model ID route PUT /machines/:machineID/prices/:pricingModelID', async () => {
		const response = await request(server)
			.put('/machines/57342663-909c-4adf-9829-6dd1a3aa9143/prices/3ba92095-3203-4888-a464-3c7d5d9acd7e');
		expect(response.status).toEqual(202);
		expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
	});
});
