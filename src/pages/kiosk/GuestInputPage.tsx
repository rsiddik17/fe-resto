import FormGuestInput from "../../components/FormGuestInput/FormGuestInput";

const GuestInputPage = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-hidden">
      {/* Logo di atas */}
      <div className="absolute top-10 w-full flex justify-center z-10">
        <img
          src="/images/logo.webp"
          alt="Logo IT'S RESTO"
          className="w-72 object-cover"
        />
      </div>
      <FormGuestInput />
    </div>
  );
};

export default GuestInputPage;
