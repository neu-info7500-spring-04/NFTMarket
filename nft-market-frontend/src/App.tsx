import { useAccount, useConnect, useDisconnect } from 'wagmi'
import {MintNFT} from './MintNFT'
import { DisplayNFTs } from './DisplayNFTs';

function App() {
  const CONTRACT_ADDRESS ="0x8Ca68D231555c79E34dEfc769a8b9529312C5711";
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {account.status !== 'connected' && connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      {account.status === 'connected' && <MintNFT address={account.address} contractAddress={CONTRACT_ADDRESS}/>}

    </>
  )
}

export default App
