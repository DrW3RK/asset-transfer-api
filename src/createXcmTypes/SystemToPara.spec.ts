// Copyright 2023 Parity Technologies (UK) Ltd.

import { Registry } from '../registry';
import { mockSystemApi } from '../testHelpers/mockSystemApi';
import { FungibleStrMultiAsset } from '../types';
import { SystemToPara } from './SystemToPara';
import { createSystemToParaMultiAssets } from './SystemToPara';

describe('SystemToPara XcmVersioned Generation', () => {
	const registry = new Registry('statemine', {});
	describe('Beneficiary', () => {
		it('Should work for V2', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				2
			);

			const expectedRes = {
				V2: {
					parents: 0,
					interior: {
						X1: {
							AccountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
								network: 'Any',
							},
						},
					},
				},
			};

			expect(beneficiary).toStrictEqual(expectedRes);
		});
		it('Should work for V2 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 2);

			const expectedRes = {
				V2: {
					parents: 0,
					interior: {
						X1: {
							AccountKey20: {
								key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
								network: 'Any',
							},
						},
					},
				},
			};

			expect(beneficiary).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const beneficiary = SystemToPara.createBeneficiary(
				'0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
				3
			);

			const expectedRes = {
				V3: {
					parents: 0,
					interior: {
						X1: {
							AccountId32: {
								id: '0xf5d5714c084c112843aca74f8c498da06cc5a2d63153b825189baa51043b1f0b',
							},
						},
					},
				},
			};

			expect(beneficiary).toStrictEqual(expectedRes);
		});
		it('Should work for V3 for an Ethereum Address', () => {
			const beneficiary = SystemToPara.createBeneficiary('0x96Bd611EbE3Af39544104e26764F4939924F6Ece', 3);

			const expectedRes = {
				V3: {
					parents: 0,
					interior: {
						X1: {
							AccountKey20: {
								key: '0x96Bd611EbE3Af39544104e26764F4939924F6Ece',
							},
						},
					},
				},
			};

			expect(beneficiary).toStrictEqual(expectedRes);
		});
	});

	describe('Destination', () => {
		it('Should work for V2', () => {
			const destination = SystemToPara.createDest('100', 2);

			const expectedRes = {
				V2: {
					parents: 1,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
		it('Should work for V3', () => {
			const destination = SystemToPara.createDest('100', 3);

			const expectedRes = {
				V3: {
					parents: 1,
					interior: {
						X1: {
							Parachain: '100',
						},
					},
				},
			};

			expect(destination).toStrictEqual(expectedRes);
		});
	});

	describe('Assets', () => {
		const isForeignAssetsTransfer = false;
		const isLiquidTokenTransfer = false;

		it('Should work for V2', async () => {
			const assets = await SystemToPara.createAssets(mockSystemApi, ['100', '100'], 2, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			});

			const expectedRes = {
				v2: [
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 1 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 2 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should work for V3 for testing this', async () => {
			const assets = await SystemToPara.createAssets(mockSystemApi, ['100', '100'], 3, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer,
			});

			const expectedRes = {
				v3: [
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 1 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 50 }, { generalIndex: 2 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
		it('Should correctly construct a liquid token transfer', async () => {
			const assets = await SystemToPara.createAssets(mockSystemApi, ['100', '100'], 3, 'statemine', ['1', '2'], {
				registry,
				isForeignAssetsTransfer,
				isLiquidTokenTransfer: true,
			});

			const expectedRes = {
				v3: [
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 55 }, { generalIndex: 1 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
					{
						id: {
							concrete: {
								parents: 0,
								interior: {
									x2: [{ palletInstance: 55 }, { generalIndex: 2 }],
								},
							},
						},
						fun: {
							fungible: 100,
						},
					},
				],
			};

			expect(assets.toJSON()).toStrictEqual(expectedRes);
		});
	});
	describe('WeightLimit', () => {
		// NOTE: for V0, V1, and V2 Weightlimit just uses V2 so we only need to test once.
		// No matter the version if its equal to or less than 2, it will alwyas default to V2.
		it('Should work when isLimited is true', () => {
			const isLimited = true;
			const refTime = '100000000';
			const proofSize = '1000';

			const weightLimit = SystemToPara.createWeightLimit(mockSystemApi, {
				isLimited,
				weightLimit: {
					refTime,
					proofSize,
				},
			});
			expect(weightLimit.toJSON()).toStrictEqual({
				limited: {
					refTime: 100000000,
					proofSize: 1000,
				},
			});
		});
		it('Should work when isLimited is falsy', () => {
			const weightLimit = SystemToPara.createWeightLimit(mockSystemApi, {});

			expect(weightLimit.toJSON()).toStrictEqual({
				unlimited: null,
			});
		});
	});

	describe('createSystemToParaMultiAssets', () => {
		it('Should correctly create system multi assets for SystemToPara xcm direction', async () => {
			const expected: FungibleStrMultiAsset[] = [
				{
					fun: {
						Fungible: '300000000000000',
					},
					id: {
						Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
							interior: {
								X2: [{ PalletInstance: '50' }, { GeneralIndex: '11' }],
							},
							parents: 0,
						}),
					},
				},
				{
					fun: {
						Fungible: '100000000000000',
					},
					id: {
						Concrete: mockSystemApi.registry.createType('XcmV2MultiLocation', {
							interior: {
								Here: '',
							},
							parents: 1,
						}),
					},
				},
			];

			const assets = ['ksm', 'usdt'];
			const amounts = ['100000000000000', '300000000000000'];
			const specName = 'statemine';
			const result = await createSystemToParaMultiAssets(
				mockSystemApi,
				amounts,
				specName,
				assets,
				registry,
				2,
				false,
				false
			);

			expect(result).toEqual(expected);
		});
	});
});
