import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const PORT = process.env.PORT || 1337;
const router = new Router();
const API = require('./controller');

router
	.use(bodyParser())
	.get('/', (ctx, next) => {
		ctx.body = 'Hello, welcome to the Polycade API';
		ctx.status = 200;
	})
	.get('/pricing-models', async (ctx, next) => {

		const pricingModels = await new API().getPricingModels();
		ctx.status = 200;
		ctx.body = pricingModels;
	})
	.post('/pricing-models', async (ctx, next) => {
		const pricingModel = ctx.request.body;
		try {
			const response = await new API().createPricingModel(pricingModel);
			ctx.body = response;
			ctx.status = 201;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.get('/pricing-models/:pricingModelID', async (ctx, next) => {
		const pricingModelID = ctx.params.pricingModelID;
		try {
			const pricingModel = await new API().getPricingModel(pricingModelID);
			ctx.body = pricingModel;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 404;
		}
	})
	.put('/pricing-models/:pricingModelID', async (ctx, next) => {
		const pricingModelID = ctx.params.pricingModelID;
		const pricingModelChanges = ctx.request.body;
		try {
			const pricingModel = await new API().updatePricingModel(pricingModelID, pricingModelChanges);
			ctx.body = pricingModel;
			ctx.status = 202;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.get('/pricing-models/:pricingModelID/prices', async (ctx, next) => {
		const pricingModelID = ctx.params.pricingModelID;
		try {
			const prices = await new API().getPricesForPricingModel(pricingModelID);
			ctx.body = prices;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 404;
		}
	})
	.post('/pricing-models/:pricingModelID/prices', async (ctx, next) => {
		const pricingModelID = ctx.params.pricingModelID;
		const newPrice = ctx.request.body;
		try {
			const response = await new API().createPricingForPricingModel(pricingModelID, newPrice);
			ctx.body = response;
			ctx.status = 201;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.del('/pricing-models/:pricingModelID/prices/:priceID', async (ctx, next) => {
		const pricingModelID = ctx.params.pricingModelID;
		const pricingID = ctx.params.priceID;
		try {
			const response = await new API().deletePricingFromPricingModel(pricingModelID, pricingID);
			ctx.body = response;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.get('/machines/:machineID', async (ctx, next) => {
		const machineID = ctx.params.machineID;
		try {
			const response = await new API().getMachine(machineID);
			ctx.body = response;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 404;
		}
	})
	.put('/machines/:machineID/prices/:pricingModelID', async (ctx, next) => {
		const machineID = ctx.params.machineID;
		const pricingModelID = ctx.params.pricingModelID;
		try {
			const response = await new API().setPricingForMachine(machineID, pricingModelID);
			ctx.body = response;
			ctx.status = 202;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.del('/machines/:machineID/prices/:pricingModelID', async (ctx, next) => {
		const machineID = ctx.params.machineID;
		const pricingModelID = ctx.params.pricingModelID;
		try {
			const response = await new API().unsetPricingForMachine(machineID, pricingModelID);
			ctx.body = response;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 400;
		}
	})
	.get('/machines/:machineID/prices', async (ctx, next) => {
		const machineID = ctx.params.machineID;
		try {
			const response = await new API().getPricingModelForMachine(machineID);
			ctx.body = response;
			ctx.status = 200;
		} catch (err) {
			ctx.body = err;
			ctx.status = 404;
		}
	});


const server = app
	.use(router.routes())
	.listen(PORT, () =>
		console.log(`Server listening on port ${PORT}`)
	);

module.exports = server;
