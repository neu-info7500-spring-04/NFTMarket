import {useReadContract} from "wagmi";
import abi from "./ContractABI.json";
import {useEffect, useState} from "react";

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
		args: tokenIds.map((id) => [id]),
	});

	useEffect(() => {
		const fetchMetadata = async () => {
			if (tokenURIs) {
				const metadata = await Promise.all(
					tokenURIs.map(async (uri) => {
						const response = await fetch(uri);
						return await response.json();
					}),
				);
				setNftMetadata(metadata);
			}
		};

		fetchMetadata();
	}, [tokenURIs]);

	if (balanceLoading || tokenURIsLoading) return <div>Loading...</div>;
	if (balanceError || tokenURIsError) return <div>Error fetching NFTs</div>;

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
