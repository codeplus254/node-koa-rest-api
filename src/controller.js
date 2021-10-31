/* eslint-disable camelcase */
/* eslint-disable radix */
// controller.js
// Logic behind the functionalities
const pricingData = require('./../prices.json');
const machineData = require('./../machines.json');
const fs = require('fs');

class Controller {
	// getting all price models for the system
	async getPricingModels () {
		// return all todos
		return new Promise((resolve, _) => resolve(pricingData));
	}

	// getting an individual pricing model
	async getPricingModel (pricingModelID) {
		return new Promise((resolve, reject) => {
			// get the pricing model
			let pricingModel;
			if (pricingModelID) {
				pricingModel = pricingData[pricingModelID];
			} else {
				// no id so default pricing
				pricingModel = pricingData.default_pricing;
			}
			if (pricingModel) {
				// return the pricing model
				resolve(pricingModel);
			} else {
				// return an error
				reject(`Pricing Model with id ${pricingModelID} not found `);
			}
		});
	}

	// getting prices for an individual pricing model
	async getPricesForPricingModel (pricingModelID) {
		return new Promise( async (resolve, reject) => {
			// get the pricing model
			try {
				let pricingModel = await this.getPricingModel(pricingModelID);
				resolve(pricingModel.pricing);
			} catch (err) {
				reject(err);
			}
		});
	}

	// creating a pricing model in the system
	async createPricingModel (pricingModel) {
		return new Promise(async (resolve, reject) => {
			// Ensure pricing model is complete
			if (!pricingModel.name) {
				reject('Missing parameters: name (str)');
			} else if (!pricingModel.pricing) {
				reject('Missing parameters: pricing (arr)');
			} else if (!pricingModel.pricing[0]) {
				reject('Please at least add one pricing object with the following keys: price (int), name (str), value (int)');
			}
			for (let [i, pricing] of pricingModel.pricing.entries()) {
				if (!pricing.price) {
					reject(`Found an error: price (int) is missing in your pricing object ${i}`);
				} else if (!pricing.name) {
					reject(`Found an error: name (str) is missing in your pricing object ${i}`);
				} else if (!pricing.value) {
					reject(`Found an error: value (int) is missing in your pricing object ${i}`);
				}
			}

			let pricingModelID = Math.floor(4 + Math.random() * 10);
			// create a pricingModel, with random id and data sent
			let newPricingModel = {
				id: pricingModelID,
				...pricingModel
			};
			pricingData[pricingModelID] = newPricingModel;
			try {
				await fs.writeFileSync('./../prices.json', pricingData, 'utf8');
				// return the new created todo
			    resolve(newPricingModel.id);
			} catch (err) {
				reject(err);
			}
		});
	}

	// adds a new price configuration for a pricing model
	async createPricingForPricingModel (pricingModelID, newPrice) {
		return new Promise( async (resolve, reject) => {
			let pricingModel;
			try {
				pricingModel = await this.getPricingModel(pricingModelID);
			} catch (err) {
				reject(err);
			}
			if (!newPrice.price) {
				reject('Found an error: price (int) is missing in your pricing object');
			} else if (!newPrice.name) {
				reject('Found an error: name (str) is missing in your pricing object');
			} else if (!newPrice.value) {
				reject('Found an error: value (int) is missing in your pricing object');
			}
			let pricingID = Math.floor(4 + Math.random() * 10);
			// create a pricingModel, with random id and data sent
			let newPricing = {
				id: pricingID,
				...newPrice
			};
			// Add the pricing object to pricing model
			pricingModel.pricing.push(newPricing);
			pricingData[pricingModelID] = pricingModel;
			try {
				await fs.writeFileSync('./../prices.json', pricingData, 'utf8');
				// return the pricing model
			    await resolve(pricingModel);
			} catch (err) {
				reject(err);
			}
		});
	}

	// updating a pricing model
	async updatePricingModel (pricingModelID, pricingModelChanges) {
		return new Promise( async (resolve, reject) => {
			// get the pricingModel
			let pricingModel;
			try {
				pricingModel = await this.getPricingModel(pricingModelID);
			} catch (err) {
				reject(err);
			}
			// if no name, return an error
			if (!pricingModelChanges.name) {
				reject('Missing parameters: name (str)');
			}
			// pricing model only contains name as meta data
			pricingModel.name = pricingModelChanges.name;
			pricingData[pricingModelID] = pricingModel;
			try {
				await fs.writeFileSync('./../prices.json', pricingData, 'utf8');
				resolve(pricingModel);
			} catch (err) {
				reject(err);
			}
		});
	}

	// removes a price configuration from a pricing model
	async deletePricingFromPricingModel (pricingModelID, pricingID) {
		return new Promise( async (resolve, reject) => {
			// get the pricingModel
			// get the pricingModel
			let pricingModel;
			try {
				pricingModel = await this.getPricingModel(pricingModelID);
			} catch (err) {
				reject(err);
			}
			let pricingToBeDeleted = pricingModel.pricing.find((pricing) => pricing.id === parseInt(pricingID));
			if (!pricingToBeDeleted) {
				reject(`No pricing with id ${pricingID} found in pricing model id ${pricingModelID}`);
			}
			let pricingArray = pricingModel.pricing.filter(item => item !== pricingToBeDeleted);
			// else, return a success message
			pricingModel.pricing = pricingArray;
			pricingData[pricingModelID] = pricingModel;
			try {
				await fs.writeFileSync('./../prices.json', pricingData, 'utf8');
				resolve(pricingModel);
			} catch (err) {
				reject(err);
			}
		});
	}

	// getting an individual pricing model
	async getMachine (machineID) {
		return new Promise((resolve, reject) => {
			// get the pricing model
			let machine = machineData[machineID];
			if (machine) {
				// return the machine
				resolve(machine);
			} else {
				// return an error
				reject(`Machine with id ${machineID} not found`);
			}
		});
	}

	// sets/updates the pricing model for an individual machine
	async setPricingForMachine (machineID, pricingModelID) {
		return new Promise( async (resolve, reject) => {

			let machine;
			// get the machine
			try {
				machine = await this.getMachine(machineID);
			} catch (err) {
				reject(err);
			}
			// get the pricingModel
			try {
				await this.getPricingModel(pricingModelID); // does it exist???
			} catch (err) {
				reject(err);
			}
			// else, update it by setting completed to true
			// eslint-disable-next-line camelcase
			machine.pricing_id = pricingModelID;
			machineData[machineID] = machine;
            
			try {
				await fs.writeFileSync('./../machine.json', machineData, 'utf8');
				resolve(machine);
			} catch (err) {
				reject(err);
			}
		});
	}

	// removes the pricing model from the machine (unsets it)
	async unsetPricingForMachine (machineID, pricingModelID) {
		return new Promise( async (resolve, reject) => {
			let machine;
			// get the machine
			try {
				machine = await this.getMachine(machineID);
			} catch (err) {
				reject(err);
			}
			if (machine.pricing_id === pricingModelID) {
				machine.pricing_id = '';
				resolve(machine);
			} else {
				reject(`No pricing model with id ${pricingModelID} found for machine with id ${machineID}`);
			}
			machineData[machineID] = machine;
			try {
				await fs.writeFileSync('./../machine.json', machineData, 'utf8');
				resolve(machine);
			} catch (err) {
				reject(err);
			}
		});
	}
	// get the pricing model and price configurations set for a given machine
	async getPricingModelForMachine (machineID) {
		return new Promise( async (resolve, reject) => {
			let machine;
			// get the machine
			try {
				machine = await this.getMachine(machineID);
			} catch (err) {
				reject(err);
			}
			let pricingModelID = machine.pricing_id;
			let pricingModel;
			if (!pricingModelID || pricingModelID === '') {
				// default pricing
				try {
					pricingModel = await this.getPricingModel();
				} catch (err) {
					reject(err);
				}

			} else {
				try {
					pricingModel = await this.getPricingModel(pricingModelID);
				} catch (err) {
					reject(err);
				}
			}
			// return the pricing model
			resolve(pricingModel);
		});
	}
}
module.exports = Controller;
