import { useSelector } from "../../store";

const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const setBlockchain = app.setBlockchain
  const connected = () => app.state.blockchain.connected

  const setConnected = (connected: boolean) => {
    setState(() => {
      return {
        ...app.state, blockchain: { ...app.state.blockchain, connected }
      }
    })
  }

  return {
    setConnected,
    setBlockchain,
    connected
  };
};

export default useSettings;
