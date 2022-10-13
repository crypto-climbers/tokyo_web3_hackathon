import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Button, Text } from "@chakra-ui/react";
import Image from "next/image";
import { ChevronDownIcon } from "@chakra-ui/icons";

const WalletConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <Box
            w='full'
            display='flex'
            justifyContent='center'
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button mt='5' onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    display='flex'
                    justifyContent='center'
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <Box>
                  <Button
                    onClick={openChainModal}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    mt='5'
                    w='52'
                  >
                    Network: {"  "}
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 15,
                          height: 15,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            width={15}
                            height={15}
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <ChevronDownIcon color='purple' />
                  </Button>
                  <br />
                  <Text textAlign='center'>Account Address</Text>
                  <Button mx='0' onClick={openAccountModal} w='52'>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </Box>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;
