import type { Component } from "solid-js";
import Footer from "./components/organisms/footer";
import Header from "./components/organisms/header";
import Settings from "./components/views/settings/settings";
import Home from "./components/views/home";
import { Router, Route, Routes } from "@solidjs/router";
import { Show, onMount } from "solid-js";
import { StoreProvider } from "./store";
import AddBookmark from "./components/views/add-bookmark";
import Loading from "./components/views/loading/loading";
import useUser from "./state/actions/user-actions";
import Login from "./components/views/login";
import useCommon from "./state/actions/common-actions";
import Error from "./components/atoms/error";
import AreYouSure from "./components/views/are-you-sure.tsx/are-you-sure";
import ExportImport from "./components/views/settings/export-import";
import Profile from "./components/views/profile";
import Sync from "./components/views/settings/sync";
import useContent from "./state/actions/content-actions";

const App: Component = () => {
  const common = useCommon();
  const userProps = useUser();
  const content = useContent();

  onMount(() => {
    userProps.identifyUser(null);
    userProps.initRender();
  })

  return (
    <StoreProvider>
      <Router>
        <div class="flex w-full h-screen justify-center overflow-hidden">
          <div

            class="bg-gradient-to-b from-lightCompliment to-primaryLight  dark:bg-gradient-to-b dark:from-darkCompliment dark:to-primaryDark to-20% transition-colors h-screen relative"
            style={{ width: "400px" }}
          >
            <Show when={common.error().globalError}>
              <div class=" w-full flex justify-center px-4 pt-4">
                <Error close={() => common.setError(null, 'globalError')} error={common.error().globalError} />
              </div>
            </Show>
            <Header />
            <Show when={!common.loading().user}>
              <Show when={userProps.authed()} fallback={<Login />}>
                <Routes>
                  <Route path="/index.html" component={Home} />
                  <Route path="/index.html/add-bookmark" component={AddBookmark} />
                  <Route path="/index.html/account" component={Settings} />
                  <Route path="/index.html/account/export-import" component={ExportImport} />
                  <Route path="/index.html/account/profile" component={Profile} />
                  <Route path="/index.html/account/sync" component={Sync} />

                </Routes>
              </Show>
            </Show>
            <Show when={content.confirmedAction()}>
              <AreYouSure onYes={content.confirmedAction()} close={() => content.setConfirmedAction(false)} />
            </Show>

            <div class="fixed bottom-0" style={{ width: "inherit" }}>
              <Footer />
            </div>
            {common.globalLoader() || common.loading().user ? <Loading /> : false}
            {/* <AreYouSure onYes={() =>{}} onNo={() => {}} /> */}

          </div>
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
