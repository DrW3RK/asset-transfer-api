// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
// import { u32 } from '@polkadot/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import type {
		VersionedMultiAssets,
} from '@polkadot/types/interfaces';

import { createXcmTypes } from '../../createXcmTypes';
import { BaseError } from '../../errors';
import type { Registry } from '../../registry';
import { Direction, XCMDestBenificiary } from '../../types';
import { establishXcmPallet } from '../util/establishXcmPallet';
import { CreateWeightLimitOpts } from '../../createXcmTypes/types';
/**
 * Build a Polkadot-js SubmittableExtrinsic for a `transferMultiAssetWithFee`
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
export const transferMultiAssets = (
	api: ApiPromise,
	direction: Direction,
	destAddr: string,
	assetIds: string[],
	amounts: string[],
	destChainId: string,
	xcmVersion: number,
	specName: string,
	registry: Registry,
	opts: CreateWeightLimitOpts,
	paysWithFeeDest?: string
): SubmittableExtrinsic<'promise', ISubmittableResult> => {
	const pallet = establishXcmPallet(api, direction);
	const ext = api.tx[pallet].transferMultiassets;
	const typeCreator = createXcmTypes[direction];

	const destWeightLimit = typeCreator.createWeightLimit(
		api,
		{
			isLimited: opts?.isLimited,
			refTime: opts?.refTime,
			proofSize: opts?.proofSize
		}
	);

	let assets: VersionedMultiAssets;
	let beneficiary: XCMDestBenificiary;

	if (
		typeCreator.createXTokensAssets &&
		typeCreator.createXTokensFeeAssetItem &&
		typeCreator.createXTokensBeneficiary
	) {
		assets = typeCreator.createXTokensAssets(
			api,
			amounts,
			xcmVersion,
			specName,
			assetIds,
			{ registry }
		);

		beneficiary = typeCreator.createXTokensBeneficiary(
			destChainId,
			destAddr,
			xcmVersion
		);

		return ext(assets, paysWithFeeDest, beneficiary, destWeightLimit);
	}

	throw new BaseError('Unable to create xTokens assets');
};
