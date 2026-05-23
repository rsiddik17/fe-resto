import FormGuestInput from "../../components/Form/FormGuestInput";

const KioskGuestInputPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-b from-primary/0 to-primary/15 relative overflow-y-auto">
      {/* Logo di atas */}
      <div className="w-full flex justify-center shrink-0 z-10 relative">
        <img
          src={`${import.meta.env.BASE_URL}images/new-logo.webp`}
          alt="Logo IT'S RESTO"
          className="w-40 md:w-70 lg:w-50 object-cover"
        />
      </div>
      <div className="w-full -mt-4 md:-mt-7 z-20 relative">
        <FormGuestInput />
      </div>
    </div>
  );
};

export default KioskGuestInputPage;
