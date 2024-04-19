import { useReadContract } from 'wagmi';
import abi from './ContractABI_V2.json';
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface Props {
    tokenId: string;
    contractAddress: `0x${string}`;
}

export function DisplayNFTPrice({ tokenId, contractAddress }: Props) {
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

    // if (isPending) return <div>Loading...</div>;

    if (error)
        return (
            <div>
                Error: {(error).shortMessage || error.message}
            </div>
        )

    const { data: hash, error: writeError, isPending: isWritePending, writeContract } = useWriteContract();

    const buyNFT = async () => {
        writeContract({
            address: contractAddress,
            abi,
            functionName: 'buyToken',
            args: [tokenId],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <>
            {isPending ? (
                <button className='nft-buy-button' disabled>Loading... | Buy</button>
            ) : (
                <button className='nft-buy-button' onClick={buyNFT}>{`${displayPrice} | Buy`}</button>
            )}
            {writeError && (
                <div>Error: {(writeError as BaseError).shortMessage || writeError.message}</div>
            )}
        </>

    )
}