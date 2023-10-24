// Copyright 2023 Parity Technologies (UK) Ltd.

import { constructForeignAssetMultiLocationFromAssetId } from './constructForeignAssetMultiLocationFromAssetId';

describe('constructForeignAssetMultiLocationFromAssetId', () => {
	it('Should correctly construct a multilocation given a multilocation assetId', () => {
		const assetId = `{"parents": "1", "interior": {"X2": [{"Parachain": "2125"}, {"GeneralIndex": "0"}]}}`;
		const foreignAssetsPalletInstance = '53';

		const expectedMultiLocation = {
			Parents: '1',
			Interior: {
				X3: [{ Palletinstance: '53' }, { Parachain: '2125' }, { Generalindex: '0' }],
			},
		};

		const multiLocation = constructForeignAssetMultiLocationFromAssetId(
			assetId,
			foreignAssetsPalletInstance,
			2
		);

		expect(JSON.stringify(multiLocation)).toEqual(JSON.stringify(expectedMultiLocation));
	});
});
