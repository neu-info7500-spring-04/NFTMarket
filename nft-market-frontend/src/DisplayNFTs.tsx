import { useState, useEffect } from 'react';
import { DisplayNFTPrice } from './DisplayNFTPrice';

interface Props {
    address: `0x${string}`;
    contractAddress: `0x${string}`;
    isConfirmed: boolean;
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

export function DisplayNFTs({ address, contractAddress, isConfirmed }: Props) { // 從props接收address
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    const ALCHEMY_API = import.meta.env.VITE_ALCHEMY_API;
    const [nfts, setNfts] = useState<NFT[]>([]);

    useEffect(() => { fetchNFTs() }, [ address, isConfirmed ]);

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
            })
            .catch(err => console.error(err));
    }
    
    return (
        <div>
        <h2>My NFTs</h2>
        <div className='nft-gallery'>
        {nfts.length > 0 ? (
            nfts.map((nft) => (
            <div className="nft" key={nft.tokenId} >
                <div className='nft-img'>
                    <img src={nft.tokenUri}/>
                </div>
                <div className='nft-name'>{`NFT ${nft.tokenId}`}</div>
                <DisplayNFTPrice tokenId={nft.tokenId} contractAddress={contractAddress} buyerAddress={address}/>
            </div>
            ))
        ) : (
            <p>No NFTs found</p>
        )}
        </div>
        </div>
    );
}