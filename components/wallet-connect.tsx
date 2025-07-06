"use client"

import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { useWallet } from "./wallet-context"

// Extend the Window interface to include the 'aptos' property
declare global {
  interface Window {
    aptos?: any
  }
}

export function WalletConnect() {
  const { address, balance, isConnected, setWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [walletType, setWalletType] = useState<string>("")

  // Check for existing connection on component mount
  useEffect(() => {
    let mounted = true

    const checkConnection = async () => {
      if (!mounted) return

      try {
        if (typeof window !== "undefined" && window.aptos) {
          const response = await window.aptos.account()
          if (mounted && response && response.address) {
            setWallet({ address: response.address, isConnected: true })
            setWalletType("Petra Wallet")
            await fetchBalance(response.address)
          }
        }
      } catch (error) {
        // Not connected or Petra not installed
      }
    }

    const timer = setTimeout(checkConnection, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  const detectWalletType = () => {
    if (typeof window !== "undefined" && window.aptos) {
      if (window.aptos.isPetra) {
        return "Petra Wallet"
      }
      return "Aptos Wallet"
    }
    return "Unknown Wallet"
  }

  const fetchBalance = async (address: string) => {
    try {
      setIsLoadingBalance(true)
      const res = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resources`)
      const resources = await res.json()
      const coin = resources.find((r: any) =>
        r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      )
      if (coin) {
        const balanceInApt = Number(coin.data.coin.value) / 1e8
        setWallet({ balance: balanceInApt.toFixed(4) })
      } else {
        setWallet({ balance: "0.0000" })
      }
    } catch (error) {
      setWallet({ balance: "0.0000" })
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      if (typeof window === "undefined" || !window.aptos) {
        toast({
          title: "No Petra wallet found",
          description: "Please install the Petra Wallet extension to connect to Aptos.",
          variant: "destructive",
        })
        setIsConnecting(false)
        return
      }

      const walletName = detectWalletType()
      setWalletType(walletName)

      const response = await window.aptos.connect()
      if (!response?.address) throw new Error("No account found")
    
    // Update ALL wallet state at once
      setWallet({
      isConnected: true,
      address: response.address,
      balance: "0.0000" // Temporary value while loading
      })

      toast({
        title: "Wallet connected to Aptos",
        description: `Connected with ${walletName}`,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })

      await fetchBalance(response.address)
      setupEventListeners()
    } catch (error: any) {
      if (error.code === 4001) {
        toast({
          title: "Connection cancelled",
          description: "You declined the connection request.",
        })
      } else {
        toast({
          title: "Connection failed",
          description: "Failed to connect wallet to Aptos. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const setupEventListeners = () => {
    if (typeof window !== "undefined" && window.aptos && window.aptos.on) {
      window.aptos.on("accountChange", async (newAccount: any) => {
        if (!newAccount || !newAccount.address) {
          disconnectWallet()
        } else {
          setWallet({ address: newAccount.address })
          await fetchBalance(newAccount.address)
        }
      })
    }
  }

  const refreshBalance = async () => {
    if (address && isConnected) {
      await fetchBalance(address)
    }
  }

  const disconnectWallet = () => {
    setWallet({ isConnected: false, address: "", balance: "0.0000" })
    setWalletType("")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected from Aptos",
    })
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">{walletType}</div>
            <div className="text-white text-sm font-mono truncate max-w-[150px]">
              {`${address.slice(0, 6)}...${address.slice(-6)}`}
            </div>
            <div className="border-t border-blue-400 my-2" />
            <div className="text-xs text-blue-300 mb-2">Connected to Aptos</div>
            <Button
              size="sm"
              onClick={disconnectWallet}
              className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
            >
              Disconnect
            </Button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">APT Balance:</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{isLoadingBalance ? "Loading..." : `${balance} APT`}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBalance}
                disabled={isLoadingBalance}
                className="text-gray-400 hover:text-white p-1 h-auto"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <>
          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
            <Wallet className="w-3 h-3 text-white font-pixel" />
          </div>
          Connect Wallet
        </>
      )}
    </Button>
  )
}