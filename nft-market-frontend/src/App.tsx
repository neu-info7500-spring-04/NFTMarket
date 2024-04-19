import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MintNFT } from './MintNFT';
import { MintERC20 } from './MintERC20';
import './index.css';
import { useState } from 'react';
import { DisplayMarket } from './DisplayMarket';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '80%'}}
      {...other}
    >
      {value === index && (<>{children}</>)}
    </div>
  );
}


function App() {
  const CONTRACT_ADDRESS = "0x3E445ba7bbdAdfD639660B373E7dF0AC987181a3";
  const TOKEN_CONTRACT_ADDRESS = "0x49fBFE1517b34D9eFd01F9e37A9400B2e00AA376"

  const account = useAccount()
  const { connectors, connect, error } = useConnect()
  const { disconnect } = useDisconnect()

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="header">
        <div className='caption'>NFT Marketplace</div>
      </div>
      <div className='main'>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Public Market Place" />
          <Tab label="Personal Page" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <DisplayMarket contractAddress={CONTRACT_ADDRESS} buyerAddress={account.address!}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
        <div className="personal">
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

            {account.status === 'connected' && <MintERC20 tokenContractAddress={TOKEN_CONTRACT_ADDRESS} />}
            {account.status === 'connected' && <MintNFT address={account.address} contractAddress={CONTRACT_ADDRESS} />}
          </div>
        </TabPanel>
      </div>

    </>
  )
}

export default App
