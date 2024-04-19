import {
	type BaseError,
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import abi from "./ContractABI_V2.json";
import erc20abi from "./ERC20ABI.json";
const TOKEN_CONTRACT_ADDRESS = "0x49fBFE1517b34D9eFd01F9e37A9400B2e00AA376";

interface Props {
	tokenId: string;
	contractAddress: `0x${string}`;
	buyerAddress?: `0x${string}`;
}

export function DisplayNFTPrice({
	tokenId,
	contractAddress,
	buyerAddress,
}: Props) {
	const {
		data: price,
		error,
		isPending,
	} = useReadContract({
		address: contractAddress,
		abi,
		functionName: "tokenPrices",
		args: [tokenId],
	});
	console.log(tokenId);
	console.log(price, typeof price);
	// 確保 price 是一個字符串
	const displayPrice =
		typeof price === "bigint" ? `${price.toString()} USDC` : "Not for sale";

	// if (isPending) return <div>Loading...</div>;

	if (error) return <div>Error: {error.shortMessage || error.message}</div>;

	const {
		data: hash,
		error: writeError,
		isPending: isWritePending,
		writeContract,
	} = useWriteContract();

	const buyNFT = async () => {
		writeContract({
			address: TOKEN_CONTRACT_ADDRESS,
			abi: erc20abi,
			functionName: "approve",
			args: [buyerAddress, price],
		});

		writeContract({
			address: contractAddress,
			abi,
			functionName: "buyToken",
			args: [tokenId],
		});
	};

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	return (
		<>
			{isPending ? (
				<button className="nft-buy-button" disabled>
					Loading... | Buy
				</button>
			) : (
				<button className="nft-buy-button" onClick={buyNFT}>
					{isConfirming
						? "Confirming..."
						: isConfirmed
							? "Confirmed"
							: `${displayPrice} | Buy`}
				</button>
			)}

			{writeError && (
				<div>
					Error: {(writeError as BaseError).shortMessage || writeError.message}
				</div>
			)}
		</>
	);
}
