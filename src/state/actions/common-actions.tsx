import { useSelector } from "../../store";
import { Bookmark, Nftmark } from "../../types/types";
import bookmarksApi from "../../api/bookmarks-api";

const useCommon = () => {
  const { app } = useSelector();
  const setState = app.setState;
  const globalLoader = () => app.state.globalLoader;
  const error = () => app.state.error;
  const loading = () => app.state.loading;


  const setError = (error: string | null, type: string) => {
    setState(() => {
      return {
        ...app.state,
        error: {
          ...app.state.error,
          [type]: error
        }
      }
    })

    setTimeout(() => {
      setState(() => {
        return {
          ...app.state,
          error: {
            ...app.state.error,
            [type]: ''
          }
        }
      })
    }, 2000)
  }

  const setGlobalLoader = (bool: boolean) => {
    setState(() => {
      return { ...app.state, globalLoader: bool }
    })
  }

  const setNotification = (notification: string, type: string) => {
    setState(() => {
      return {
        ...app.state, 
        notifications: {
          [type]: notification
        }
      }
    })
  }

  const setLoading = (bool: Boolean, type: string) => {
    setState(() => {
      return { ...app.state, loading: { ...app.state.loading, [type]: bool } }
    })
  }


  return {
    setError,
    setGlobalLoader,
    globalLoader,
    setNotification,
    error,
    loading,
    setLoading
  };
};

export default useCommon;
