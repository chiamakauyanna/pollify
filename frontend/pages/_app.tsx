import { store } from "../redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { Nunito, Fredoka } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

// Extend AppProps to allow pages to have a getLayout function
type NextAppPropsWithLayout = AppProps & {
  Component: AppProps["Component"] & {
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
};

export default function App({ Component, pageProps }: NextAppPropsWithLayout) {
  // Use page-level layout if defined, otherwise just render page
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider store={store}>
      <main className={`${nunito.variable} ${fredoka.variable}`}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </Provider>
  );
}
