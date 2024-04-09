import { useState, useEffect } from 'react';

interface Props {
    address: `0x${string}`;
    contractAddress: `0x${string}`;
}

interface Data {
    contract: {
        name: string;
        symbol: string;
    };
    tokenId: string;
    tokenUri: string;
}

interface NFT {
    name: string;
    symbol: string;
    tokenId: string;
    tokenUri: string;
}

export function DisplayNFTs({ address, contractAddress }: Props) { // 從props接收address
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    const ALCHEMY_API = import.meta.env.VITE_ALCHEMY_API;
    const [nfts, setNfts] = useState<NFT[]>([]);

    useEffect(() => { fetchNFTs() }, [ address ]);

    function fetchNFTs() {
        fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddress}&withMetadata=true&pageSize=100`, options)
            .then(response => response.json())
            .then(response => {
                const nftData = response.ownedNfts.map((data:Data) => ({
                    name: data.contract.name,
                    symbol: data.contract.symbol,
                    tokenId: data.tokenId,
                    tokenUri: data.tokenUri
                }));
                setNfts(nftData);
                console.log(response)
            })
            .catch(err => console.error(err));
    }
    
    return (
        <div>
        <h2>My NFTs</h2>
        {nfts.length > 0 ? (
            nfts.map((nft) => (
            <img key={nft.tokenId} src={nft.tokenUri} alt={`NFT ${nft.tokenId}`} style={{ width: 100, height: 100 }} />
            ))
        ) : (
            <p>No NFTs found</p>
        )}
        </div>
    );
}