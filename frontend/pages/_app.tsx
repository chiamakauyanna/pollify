import { store } from "../redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { Nunito, Fredoka } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className={`${nunito.variable} ${fredoka.variable}`}>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
