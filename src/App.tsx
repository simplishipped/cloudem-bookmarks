import type { Component } from "solid-js";
import Footer from "./components/organisms/footer";
import Header from "./components/organisms/header";
import Settings from "./components/views/settings/settings";
import Home from "./components/views/home";
import { Router, Route, Routes } from "@solidjs/router";
import { Show, createEffect, onMount } from "solid-js";
import { StoreProvider } from "./store";
import Networks from "./components/views/settings/networks";
import AddBookmark from "./components/views/add-bookmark";
import Market from "./components/views/market";
import Mint from "./components/views/mint";
import Loading from "./components/views/loading/loading";
import useUser from "./state/actions/user-actions";
import Login from "./components/views/login";
import useCommon from "./state/actions/common-actions";
import Error from "./components/atoms/error";
import AreYouSure from "./components/views/arey-you-sure.tsx/are-you-sure";
import ExportImport from "./components/views/settings/export-import";
import Profile from "./components/views/profile";

const App: Component = () => {
  const common = useCommon();
  const userProps = useUser();
  onMount(() => {
    userProps.identifyUser(null);
    userProps.initRender();
  })

  return (
    <StoreProvider>
      <Router>
        <div class="flex w-full h-screen justify-center overflow-hidden">
          <div
            class="bg-primaryLight dark:bg-primaryDark transition-colors h-screen relative"
            style={{ width: "400px" }}
          >
            <Show when={common.error().globalError}>
              <div class=" w-full flex justify-center px-6 pt-4">
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
                  <Route path="/index.html/account/networks" component={Networks} />
                  <Route path="/index.html/market" component={Market} />
                  <Route path="/index.html/mint" component={Mint} />
                  <Route path="/index.html/account/export-import" component={ExportImport} />
                  <Route path="/index.html/account/profile" component={Profile} />
                </Routes>
              </Show>
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
