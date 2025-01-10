import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
  FaMobile,
  FaGamepad,
} from 'react-icons/fa';
import { SiNintendoswitch, SiNintendo3Ds, SiWii, SiSega } from 'react-icons/si';
import { BsGlobe } from 'react-icons/bs';

const platformIcons = {
  pc: FaWindows,
  playstation: FaPlaystation,
  xbox: FaXbox,
  ios: FaApple,
  mac: FaApple,
  linux: FaLinux,
  android: FaAndroid,
  nintendo: SiNintendoswitch,
  'nintendo-switch': SiNintendoswitch,
  '3ds': SiNintendo3Ds,
  wii: SiWii,
  sega: SiSega,
  web: BsGlobe,
  mobile: FaMobile,
};

const PlatformIcon = ({ platform, className = "" }) => {
  // Normalizza il nome della piattaforma
  const normalizedPlatform = platform.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // Cerca l'icona corrispondente o usa l'icona generica
  const IconComponent = platformIcons[normalizedPlatform] || FaGamepad;
  
  return <IconComponent className={`inline-block ${className}`} />;
};

export default PlatformIcon;
