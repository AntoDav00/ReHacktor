import {
  FaDesktop,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from 'react-icons/fa';
import { 
  SiNintendoswitch, 
  SiSteam, 
  SiEpicgames, 
  SiGogdotcom 
} from 'react-icons/si';
import { BsGlobe } from 'react-icons/bs';

const platformGroups = {
  pc: ['pc', 'windows', 'linux', 'mac', 'steam', 'epic games', 'gog'],
  playstation: ['playstation', 'ps4', 'ps5', 'psp'],
  xbox: ['xbox', 'xbox one', 'xbox series x/s'],
  nintendo: ['nintendo', 'nintendo switch', '3ds', 'wii', 'game boy'],
  mobile: ['ios', 'android', 'mobile'],
  web: ['web', 'browser']
};

const platformIcons = {
  pc: FaDesktop,
  playstation: FaPlaystation,
  xbox: FaXbox,
  nintendo: SiNintendoswitch,
  mobile: FaAndroid,
  web: BsGlobe,
  steam: SiSteam,
  epicgames: SiEpicgames,
  gog: SiGogdotcom,
  mac: FaApple,
  linux: FaLinux
};

const PlatformIcon = ({ platform, className = "" }) => {
  // Normalizza il nome della piattaforma
  const normalizedPlatform = platform.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // Trova il gruppo della piattaforma
  const platformGroup = Object.keys(platformGroups).find(group => 
    platformGroups[group].some(p => normalizedPlatform.includes(p))
  );

  // Cerca l'icona corrispondente o usa l'icona generica
  const IconComponent = platformIcons[platformGroup] || platformIcons[normalizedPlatform] || FaDesktop;
  
  return <IconComponent className={`inline-block ${className}`} />;
};

export default PlatformIcon;
