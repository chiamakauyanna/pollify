import { LayoutProps } from "@/Interfaces/interface";
import Footer from "./LandingFooter";
import Header from "./LandingHeader";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main  className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
