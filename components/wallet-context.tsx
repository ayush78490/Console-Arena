import React, { createContext, useContext, useState, useCallback } from "react"

interface WalletState {
  address: string
  balance: string
  isConnected: boolean
}

interface WalletContextType extends WalletState {
  setWallet: (state: Partial<WalletState>) => void
}

const WalletContext = createContext<WalletContextType>({
  address: "",
  balance: "0.0000",
  isConnected: false,
  setWallet: () => {},
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: "",
    balance: "0.0000",
    isConnected: false,
  })

  // Use useCallback to memoize the setWallet function
  const setWallet = useCallback((state: Partial<WalletState>) => {
    setWalletState(prev => ({
      ...prev,
      ...state,
    }))
  }, [])

  return (
    <WalletContext.Provider value={{ ...walletState, setWallet }}>
      {children}
    </WalletContext.Provider>
  )
}