import { store } from "../redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import AuthInitializer from "./auth/components/AuthInitializer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <Component {...pageProps} />
    </Provider>
  );
}
