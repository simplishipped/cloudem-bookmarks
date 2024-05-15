import type { Component } from "solid-js";
// import styles from "./App.module.css";
import Footer from "./components/organisms/footer";
import Header from "./components/organisms/header";
import Settings from "./components/views/settings/settings";
import Home from "./components/views/home";
import { Router, Route, Routes } from "@solidjs/router";
import { Show } from "solid-js";
import { StoreProvider } from "./store";
import Networks from "./components/views/settings/networks";
import AddNftMark from "./components/views/add-bookmark";
import Market from "./components/views/market";
import Mint from "./components/views/mint";
import supabase from './api/supabase.jsx';
import Loading from "./components/views/loading/loading";
import useContent from "./state/actions/content-actions";
import useUser from "./state/actions/user-actions";
const App: Component = () => {

  const { globalLoader } = useContent();
  const { authed } = useUser();

  return (
    <StoreProvider>
      <Router>
        <div class="flex w-full h-screen justify-center overflow-hidden">
          <div
            class="bg-primaryLight dark:bg-primaryDark transition-colors h-screen relative"
            style={{ width: "400px" }}
          >
            <Header />
            <Routes>
              <Route path="/" component={Home} />
              <Show when={authed()}>
                <Route path="/account" component={Settings} />
                <Route path="/account/networks" component={Networks} />
                <Route path="/add-nft-mark" component={AddNftMark} />
                <Route path="/market" component={Market} />
                <Route path="/mint" component={Mint} />
              </Show>
            </Routes>
            <div class="fixed bottom-0" style={{ width: "inherit" }}>
              <Footer />
            </div>
            {globalLoader() ? <Loading /> : false}
          </div>
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
