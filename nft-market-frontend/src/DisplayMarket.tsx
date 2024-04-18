import { useState, useEffect } from 'react';
import { DisplayNFTPrice } from './DisplayNFTPrice';

interface Props {
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

export function DisplayMarket({ contractAddress }: Props) {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const ALCHEMY_API = import.meta.env.VITE_ALCHEMY_API;
    const [nfts, setNfts] = useState<NFT[]>([]);

    useEffect(() => { fetchNFTsFromContract() }, []);

    function fetchNFTsFromContract() {
        fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${ALCHEMY_API}/getNFTsForContract?contractAddress=${contractAddress}&withMetadata=true`, options)
            .then(response => response.json())
            .then(response => {
                const nftData = response.nfts.map((data: Data) => ({
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
        <div className="personal">
            <h2>{`All NFTs (Contract: ${contractAddress})`}</h2>
            <div className='nft-gallery'>
                {nfts.length > 0 ? (
                    nfts.map((nft) => (
                        <div className="nft" key={nft.tokenId} >
                            <div className='nft-img'>
                                <img src={nft.tokenUri} />
                            </div>
                            <div className='nft-name'>{`${nft.name} #${nft.tokenId}`}</div>
                            <DisplayNFTPrice tokenId={nft.tokenId} contractAddress={contractAddress} />
                        </div>
                    ))
                ) : (
                    <p>No NFTs found</p>
                )}
            </div>
        </div>
    );
}