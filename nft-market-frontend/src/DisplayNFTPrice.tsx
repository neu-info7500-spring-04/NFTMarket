import {
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import abi from "./ContractABI_V2.json";
import erc20abi from "./ERC20ABI.json";
import { useEffect, useState } from "react";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import React from "react";
const TOKEN_CONTRACT_ADDRESS = "0x49fBFE1517b34D9eFd01F9e37A9400B2e00AA376";

interface Props {
	tokenId: string;
	contractAddress: `0x${string}`;
	buyerAddress?: `0x${string}`;
}

interface State extends SnackbarOrigin {
	open: boolean;
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

	// if is sold
	const [isSold, setIsSold] = useState(false);

	// error alert
	const [state, setState] = React.useState<State>({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});
	const { vertical, horizontal, open } = state;
	const [errorMessage, SetErrorMessage] = useState("");
	const [tempOwner, setTempOwner] = useState("");


	// 確保 price 是一個字符串
	const displayPrice =
		typeof price === "bigint" ? `${price.toString()} USDC` : "Not for sale";
	const approvePrice = typeof price === "bigint" ? `${(price + 20n).toString()}000000000000000000` : "";

	// if (isPending) return <div>Loading...</div>;

	if (error) return <div>Error: {error.shortMessage || error.message}</div>;

	const {
		data: hash,
		writeContract,
	} = useWriteContract();

	const approve = () => {
		writeContract({
			address: TOKEN_CONTRACT_ADDRESS,
			abi: erc20abi,
			functionName: "approve",
			args: [contractAddress, approvePrice],
		});
	}
	const transfer = () => {
		writeContract({
			address: contractAddress,
			abi,
			functionName: "buyToken",
			args: [tokenId],
		});
	};

	const buyNFT = async () => {
		const data = await fetchNFTOwner();
		if (data.owners[0] !== buyerAddress) {
			approve();
		} else {
			setState({
				open: true,
				vertical: 'top',
				horizontal: 'center'
			});
			SetErrorMessage("It's your NFT!!!");
		}
	}

	const handleClose = () => {
		setState({
			open: false,
			vertical: 'top',
			horizontal: 'center'
		});
	}

	// confirm approval
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	useEffect(() => {
		if (isSold) {
		} else {
			if (isConfirmed) {
				transfer();
				setIsSold(true);
			}
		}
	}, [isConfirmed]);

	// check owner
	const options = { method: 'GET', headers: { accept: 'application/json' } };
	const ALCHEMY_API = import.meta.env.VITE_ALCHEMY_API;

	async function fetchNFTOwner() {
		try {
			const response = await fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API}/getOwnersForNFT?contractAddress=${contractAddress}&tokenId=${tokenId}`, options);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('There was a problem with your fetch operation:', error);
		}
	}

	return (
		<>
			{isPending ? (
				<button className="nft-buy-button" disabled>
					Loading... | Buy
				</button>
			) :
				displayPrice === '0 USDC' ? (<button className="nft-buy-button" disabled>
					Not for sale
				</button>) : (<button className="nft-buy-button" onClick={buyNFT}>
					{
						isConfirming
							? "Confirming..."
							: isConfirmed
								? "Confirmed"
								: `${displayPrice} | Buy`}
				</button >)
			}

			{
				open && <Snackbar
					anchorOrigin={{ vertical, horizontal }}
					open={open}
					onClose={handleClose}
					autoHideDuration={3000}
					message={errorMessage}
					key={vertical + horizontal}
				/>
			}
		</>
	);
}
