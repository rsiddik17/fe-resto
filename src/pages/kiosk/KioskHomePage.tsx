import { Link } from "react-router";

const KioskHomePage = () => {

  return (
    <Link to="/kiosk/guest-input" replace className="block w-full h-screen bg-[url(/images/banner-kiosk.webp)] bg-no-repeat bg-cover bg-center cursor-pointer" aria-label="Sentuh Layar Untuk Memesan">
    </Link>
  );
};

export default KioskHomePage;
