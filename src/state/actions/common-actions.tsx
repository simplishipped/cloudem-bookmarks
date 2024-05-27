import { useSelector } from "../../store";
import { Bookmark, Nftmark } from "../../types/types";
import bookmarksApi from "../../api/bookmarks-api";

const useCommon = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const signUpError = () => app.state.signUpError;
  const globalLoader = () => app.state.globalLoader;


  const setError = (error: string, type: string) => {
    setState(() => {
      return {
       ...app.state,
        [type]: error
      }
    })
  }

  const setGlobalLoader = (bool: boolean) => {
    setState(() => {
      return { ...app.state, globalLoader: bool }
    })
  }
  return {
    signUpError,
    setError,
    setGlobalLoader,
    globalLoader
  };
};

export default useCommon;
