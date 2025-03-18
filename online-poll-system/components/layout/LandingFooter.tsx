import { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="flex justify-center py-6 bg-primary">
      <p className="text-sm text-background">{`© ${year}. All Rights Reserved.`}</p>
    </footer>
  );
};

export default Footer;
