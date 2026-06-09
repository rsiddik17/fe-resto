interface SortIconProps {
  isActiveAsc: boolean;
  isActiveDesc: boolean;
  isInverse?: boolean; // Tambahkan ini
}

export default function SortIcon({ isActiveAsc, isActiveDesc, isInverse = false }: SortIconProps) {
  // Jika isInverse true, pakai warna untuk background gelap (putih), jika false pakai warna standar (gray)
  const inactiveColor = isInverse ? "text-white/40" : "text-gray-500";
  const activeColor = isInverse ? "text-white" : "text-primary";

  return (
    <div className="flex flex-col items-center justify-center -gap-1 ml-2">
      {/* Ikon Atas */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="10" 
        height="10" 
        viewBox="0 0 640 640"
        className={isActiveAsc ? activeColor : inactiveColor}
      >
        <path fill="currentColor" d="M160 288c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 7-34.8l160-160c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9S492.9 288 480 288z" />
      </svg>

      {/* Ikon Bawah */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="10" 
        height="10" 
        viewBox="0 0 640 640"
        className={isActiveDesc ? activeColor : inactiveColor}
      >
        <path fill="currentColor" d="M160 352c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 7 34.8l160 160c12.5 12.5 32.8 12.5 45.3 0l160-160c9.2-9.2 11.9-22.9 6.9-34.9S492.9 352 480 352z" />
      </svg>
    </div>
  );
}