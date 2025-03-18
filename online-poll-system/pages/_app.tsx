import Layout from "@/components/layout/Layout";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { NextComponentType } from "next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

type CustomAppProps = AppProps & {
  Component: NextComponentType & { noLayout?: boolean };
};

export default function App({ Component, pageProps }: CustomAppProps) {
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
