import { useSelector } from "../../store";

const useTheme = () => {
  const { app } = useSelector();
  const appState = () => app.state;
  const theme = () => app.state.theme;
  const setTheme = app.setTheme;
  return {
    appState,
    theme,
    setTheme,
  };
};

export default useTheme;
