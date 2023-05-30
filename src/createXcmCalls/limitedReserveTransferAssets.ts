// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import { createXcmTypes } from '../createXcmTypes';
import { Direction } from '../types';
import { normalizeArrToStr } from '../util/normalizeArrToStr';
import { establishXcmPallet } from './util/establishXcmPallet';

/**
 * Build a Polkadot-js SubmittableExtrinsic for a `limitedReserveTransferAssets`
 * call.
 *
 * @param api ApiPromise
 * @param direction Denotes the xcm direction of the call.
 * @param destAddr The address the funds will be transfered too.
 * @param assetIds An array of asset ids. Note, this should be the same size and order as amounts.
 * @param amounts An array of amounts. Note, this should be the same size and order as assetIds.
 * @param destChainId The id of the destination chain. This will be zero for a relay chain.
 * @param xcmVersion Supported XCM version.
 */
export const limitedReserveTransferAssets = (
	api: ApiPromise,
	direction: Direction,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	destChainId: string,
	xcmVersion: number,
	specName: string,
	weightLimit?: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	const pallet = establishXcmPallet(api);
	const ext = api.tx[pallet].limitedReserveTransferAssets;
	const typeCreator = createXcmTypes[direction];
	const beneficiary = typeCreator.createBeneficiary(api, destAddr, xcmVersion);
	const dest = typeCreator.createDest(api, destChainId, xcmVersion);
	const assets = typeCreator.createAssets(
		api,
		normalizeArrToStr(amounts),
		xcmVersion,
		specName,
		assetIds
	);
	const weightLimitType = typeCreator.createWeightLimit(api, weightLimit);

	return ext(dest, beneficiary, assets, 0, weightLimitType);
};
