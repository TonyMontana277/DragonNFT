// Import modules
const FormData = require("form-data")
const fetch = require("node-fetch")
const fs = require("fs")
const Web3 = require("web3");
const { ethers } = require("ethers");
require('dotenv').config()

// Function to upload the file for the NFT
const uploadImage = async (file) => {
    try {
      const data = new FormData()
      data.append("file", fs.createReadStream(file)) 
      data.append("pinataMetadata", '{"name": "dragon"}')
  
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        },
        body: data
      })
      resData = await res.json()
      console.log("File uploaded, CID:", resData.IpfsHash)
      return resData.IpfsHash
    } catch (error) {
      console.log(error)
    }
  }

  // Function to upload Metadata for NFT
const uploadMetadata = async (name, description, external_url, CID) => {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: `${name}`,
        description: `${description}`,
        external_url: `${external_url}`,
        image: `ipfs://${CID}`,
      },
      pinataMetadata: {
        name: "Pinnie NFT Metadata",
      },
    });

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
      },
      body: data
    })
    const resData = await res.json()
    console.log("Metadata uploaded, CID:", resData.IpfsHash)
    return resData.IpfsHash
  } catch (error) {
    console.log(error)
  }
}

// Function to mint the NFT
const mintNft = async (CID, wallet) => {
  try {
    const data = JSON.stringify({
      recipient: `polygon:${wallet}`,
      metadata: `https://gateway.pinata.cloud/ipfs/${CID}`
    })
    const res = await fetch("https://staging.crossmint.com/api/2022-06-09/collections/default/nfts", {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-client-secret': `${process.env.CROSSMINT_CLIENT_SECRET}`,
        'x-project-id': `${process.env.CROSSMINT_PROJECT_ID}`
      },
      body: data
    })
    resData = await res.json()
    const contractAddress = resData.onChain.contractAddress
    console.log("NFT Minted, smart contract:", contractAddress)
    console.log(`View NFT at https://testnets.opensea.io/assets/mumbai/${contractAddress}`)
  } catch (error) {
    console.log(error)
  }
}

const main = async (file, name, description, external_url, wallet) => {
  try {
    const imageCID = await uploadImage(file)
    const metadataCID = await uploadMetadata(name, description, external_url, imageCID)
    await mintNft(metadataCID, wallet)
  } catch (error) {
    console.log(error)
  }
}
  
  main(
    // relative path to the file being used
    "./assets/image (2).png",
    // Name of the NFT
    "Carpathian Dragon",
    // Description of the NFT
    "Dragon belongs to Zoloto Karpat, if you have the NFT, return it to the owner",
    // External URL for the NFT
    "https://pinata.cloud",
    // Wallet address where the NFT will be minted to 
    "0xa12Fe186B5DEdBe7E650AeC0ff6D50f6A889dce3"
  )