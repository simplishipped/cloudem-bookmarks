import { useSelector } from "../../../store";

const useSettings = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const setBlockchain = app.setBlockchain
  const blockchain = () => app.state.blockchain
  const landingView = () => app.state.landingView

  const setConnected = (connected: boolean) => {
    setState(() => {
      return {
        ...app.state, blockchain: { ...app.state.blockchain, connected }
      }
    })
  }

  const setLandingView = (landingView: boolean) => {
    setState(() => {
      return {
       ...app.state, landingView
      }
    })
  }

  return {
    setConnected,
    setBlockchain,
    blockchain,
    landingView,
    setLandingView  
  };
};

export default useSettings;
