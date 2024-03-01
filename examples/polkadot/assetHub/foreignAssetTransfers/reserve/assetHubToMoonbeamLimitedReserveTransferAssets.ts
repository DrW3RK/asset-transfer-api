/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../../../../../src';
import { TxResult } from '../../../../../src/types';
import { GREEN, PURPLE, RESET } from '../../../../colors';

/**
 * In this example we are creating a `polkadotXcm` pallet `limitedReserveTransferAssets` call to send KSM (foreign asset with location '{"parents":"1","interior":{"X1":{"GlobalConsensus":"Kusama"}}}')
 * from a Polkadot Asset Hub (System Parachain) account
 * to a Moonbeam (ParaChain) account, where the `xcmVersion` is set to 3, the `isLimited` option is set to true and there is no
 * `weightLimit` option provided which declares that the tx will allow unlimited weight to be used for fees.
 *
 * NOTE: When `isLimited` is true it will use the `limited` version of either `reserveTransferAssets`, or `teleportAssets`.
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-asset-hub-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'call'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'2004', // Note: Parachain ID 2004 (Moonbeam) is different than the asset location's `Parachain` Id, making this a `reserveTransferAssets` call
			'5EWNeodpcQ6iYibJ3jmWVe85nsok1EDG8Kk3aFg8ZzpfY1qX',
			['{"parents":"2","interior":{"X1":{"GlobalConsensus":"Kusama"}}}'],
			['1000000000000'],
			{
				format: 'call',
				isLimited: true,
				xcmVersion: 3,
			},
		);

		console.log(callInfo);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
