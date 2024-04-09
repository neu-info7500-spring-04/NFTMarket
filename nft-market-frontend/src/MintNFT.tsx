import abi from './ContractABI.json';
import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi' 
interface Props {
  contractAddress: `0x${string}`;
}

export function MintNFT( {contractAddress}:Props ) {
  const { data: hash, error, isPending, writeContract } = useWriteContract() 

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const tokenURI = formData.get('tokenURI') as string 
    
    writeContract({ 
      address: contractAddress, 
      abi, 
      functionName: 'createToken', 
      args: [tokenURI], 
    }) 
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  return (
    <form onSubmit={submit}>
      {/* <input name="address" placeholder="0xA0Cf…251e" required /> */}
      <input name="tokenURI" placeholder="imageIPFS" required />
      <button type="submit" disabled={isPending} >{isPending ? 'Confirming...' : 'Mint'}</button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )}
    </form>
  )
} 