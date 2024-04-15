import erc20Abi from './ERC20ABI.json';
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi' 

interface Props {
  tokenContractAddress: `0x${string}`;
}

export function MintERC20( {tokenContractAddress}:Props ) {
    const { data: hash, error, isPending, writeContract } = useWriteContract()
    
    async function handleMint() {
        writeContract({
        address: tokenContractAddress,
        abi: erc20Abi,
        functionName: 'mintToCaller',
        })  
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

    return (
    <>
      <button type="button" onClick={handleMint} disabled={isPending} >{isPending ? 'Confirming...' : 'Get TestUSDC'}</button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )}
    </>
  )
}