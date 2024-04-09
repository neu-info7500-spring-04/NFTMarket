import { useReadContract } from "wagmi";
import abi from "./ContractABI.json";
import { useEffect, useState } from "react";

export function NFTList({ userAddress }: { userAddress: `0x${string}` }) {
	const contractAddress = "0x8Ca68D231555c79E34dEfc769a8b9529312C5711";
	const [nftMetadata, setNftMetadata] = useState([]);

	const {
		data: balance,
		isError: balanceError,
		isLoading: balanceLoading,
	} = useReadContract({
		address: contractAddress,
		abi,
		functionName: "balanceOf",
		args: [userAddress],
	});

	const tokenIds = Array.from(
		{ length: balance?.toNumber() ?? 0 },
		(_, index) => index,
	);

	const {
		data: tokenURIs,
		isError: tokenURIsError,
		isLoading: tokenURIsLoading,
	} = useReadContract({
		address: contractAddress,
		abi,
		functionName: "tokenURI",
		args: tokenIds.map((id) => [id])
	});

	useEffect(() => {
		const fetchNFTs = async () => {
			if (balance && !balanceLoading && !balanceError) {
				const tokenIds = [];
				for (let i = 0; i < balance.toNumber(); i++) {
					const { data: tokenId } = useReadContract({
						address: contractAddress,
						abi,
						functionName: "tokenOfOwnerByIndex",
						args: [userAddress, i],
					});
					tokenIds.push(tokenId);
				}

				const tokenURIs = await Promise.all(
					tokenIds.map(async (tokenId) => {
						const { data: tokenURI } = useReadContract({
							address: contractAddress,
							abi,
							functionName: "tokenURI",
							args: [tokenId],
						});
						return tokenURI;
					}),
				);

				const metadata = await Promise.all(
					tokenURIs.map(async (uri) => {
						const response = await fetch(uri);
						return await response.json();
					}),
				);

				setNftMetadata(metadata);
			}
		};

		fetchNFTs();
	}, [balance, balanceLoading, balanceError, userAddress]);

	if (balanceLoading || tokenURIsLoading) {
		console.log("Loading...");
		console.log("Balance loading:", balanceLoading);
		console.log("Token URIs loading:", tokenURIsLoading);
		return <div>Loading...</div>;
	}

	if (balanceError || tokenURIsError) {
		console.error("Error fetching NFTs");
		console.error("Balance error:", balanceError);
		console.error("Token URIs error:", tokenURIsError);
		return <div>Error fetching NFTs</div>;
	}

	console.log("NFT metadata:", nftMetadata);

	return (
		<div>
			<h2>Your NFTs</h2>
			{nftMetadata.map((metadata, index) => (
				<div key={index}>
					<h3>{metadata.name}</h3>
					<img src={metadata.image} alt={metadata.name} />
					<p>{metadata.description}</p>
				</div>
			))}
		</div>
	);
}
