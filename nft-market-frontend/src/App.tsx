import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MintNFT } from './MintNFT';
import { MintERC20 } from './MintERC20';
import './index.css';

function App() {
  const CONTRACT_ADDRESS = "0x85FAD331426db7fdb82E4EAdE05Bae889fC44695";
  const TOKEN_CONTRACT_ADDRESS = "0x49fBFE1517b34D9eFd01F9e37A9400B2e00AA376"

  const account = useAccount()
  const { connectors, connect, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <div className="header">
        <div className='caption'>NFT Marketplace</div>
      </div>
      <div className='main'>
        <h2>Account</h2>
        <div className='account'>
          <div className='account-info'>
            status: {account.status}
            <br />
            addresses: {JSON.stringify(account.addresses)}
            <br />
            chainId: {account.chainId}
          </div>

          {account.status === 'connected' && (
            <button className="disconnect" type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          )}
        </div>

        {account.status !== 'connected' && <div>
          <h2>Connect</h2>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
              className="connector"
            >
              {connector.name}
            </button>
          ))}
          {/* <div>{status}</div> */}
          <div>{error?.message}</div>
        </div>}
        
        {account.status === 'connected' && <MintERC20 tokenContractAddress={TOKEN_CONTRACT_ADDRESS}/>}
        {account.status === 'connected' && <MintNFT address={account.address} contractAddress={CONTRACT_ADDRESS} />}
      </div>
    </>
  )
}

export default App
