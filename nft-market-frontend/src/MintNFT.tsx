import abi from './ContractABI.json';
import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi' 
 
export function MintNFT() {
  const { data: hash, error, isPending, writeContract } = useWriteContract() 
  const contractAddress ="0x8Ca68D231555c79E34dEfc769a8b9529312C5711";

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    const tokenURI = formData.get('tokenURI') as string 
    
    console.log(abi)
    
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