import React, { useEffect, useState } from 'react'
import Upload from './artifacts/contracts/Upload.sol/Upload.json'
import { ethers } from 'ethers'
import FileUpload from "./components/FileUplaod";
import Display from "./components/Display";
import Modal from "./components/Modal";

const App = () => {
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)


  useEffect(()=>{
    const loadProvider = async ()=>{
      if(window.ethereum){
        const _provider = new ethers.BrowserProvider(window.ethereum)
        window.ethereum.on('accountsChanged', async (accounts) => {
          window.location.reload()
        })
        window.ethereum.on('chainChanged', async (chainId) => {
          window.location.reload()
        })
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const signer = await _provider.getSigner()
        const _account = await signer.getAddress()
        let contractAddress = '0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f'
        const _contract = new ethers.Contract(contractAddress, Upload.abi, signer)
        setContract(_contract)
        setAccount(_account)
        setProvider(_provider)
      }
      else{
        alert('Install Metamask')
      }
    }
    loadProvider()
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white font-sans flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-600">
        IPFS Locker
        </h1>
        {!modalOpen && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ml-5 text-center mb-3"
          >
            Grant and Revoke Access
          </button>
        )}
        <p className="mb-8 text-xl font-medium">
          Account:{" "}
          <span className="font-bold text-yellow-300">
            {account ? account : "Not connected"}
          </span>
        </p>

        

        {modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
        )}

        <div className="mt-10 w-full flex flex-col items-center space-y-10">
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          ></FileUpload>

          <Display contract={contract} account={account}></Display>
        </div>

        <div className="absolute inset-0 -z-10">
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 absolute w-full h-full opacity-80"></div>
          <div className="bg-gradient-to-r from-pink-500 to-yellow-500 blur-3xl w-64 h-64 rounded-full absolute top-20 left-10 opacity-40"></div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl w-64 h-64 rounded-full absolute bottom-20 right-10 opacity-40"></div>
        </div>
      </div>
    </div>
  )
}

export default App