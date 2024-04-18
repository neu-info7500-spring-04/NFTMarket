import { useReadContract } from 'wagmi'
import abi from './ContractABI_V2.json';

interface Props {
    tokenId: string;
    contractAddress: `0x${string}`;
}

export function DisplayNFTPrice({tokenId, contractAddress}: Props) {
    const { data: price, error, 
    isPending } = useReadContract({
        address: contractAddress,
        abi,
        functionName: 'tokenPrices',
        args: [tokenId]
    });
    console.log(tokenId);
    console.log(price, typeof price);
    // 確保 price 是一個字符串
    const displayPrice = typeof price === 'bigint' ? `${price.toString()} USDC` : 'Not for sale';

    if (isPending) return <div>Loading...</div>;

    if (error) 
        return ( 
        <div> 
            Error: {(error).shortMessage || error.message} 
        </div> 
        )

    return (
        <div className='nft-price'>
            {displayPrice}
        </div>
    )
}