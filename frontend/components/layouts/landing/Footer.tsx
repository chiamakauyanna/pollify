const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex justify-center py-6 bg-primary mt-20">
      <p className="text-sm text-background">{`© ${currentYear} Pollify. All Rights Reserved.`}</p>
    </footer>
  );
};

export default Footer;
