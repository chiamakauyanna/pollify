import Layout from "@/components/layout/LandingLayout";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: any }) {
  const useLayout = !Component.noLayout;

  return useLayout ? (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  ) : (
    <Component {...pageProps} />
  );
}
