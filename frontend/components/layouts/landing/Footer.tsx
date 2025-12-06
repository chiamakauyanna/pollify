import { useState, useEffect } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="flex justify-center py-6 bg-primary mt-20">
      <p className="text-sm text-background">{`© ${year} Pollify. All Rights Reserved.`}</p>
    </footer>
  );
};

export default Footer;
