import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaStar, FaComment, FaTrash, FaHeart, FaClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, toggleFavorite } from '../utils/firebase';
import { getComments } from '../utils/firebaseComments';
import LoadingSkeleton from '../components/Features/LoadingSkeleton';
import PlatformIcon from '../components/Features/PlatformIcon';
import Slider from 'react-slick';
import { toast } from 'react-hot-toast';
import CommentDeleteModal from '../components/Game/CommentDeleteModal';
import GameCard from '../components/Game/GameCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [favouriteGames, setFavouriteGames] = useState([]);
  const [recentlyAddedGames, setRecentlyAddedGames] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screenshots, setScreenshots] = useState({});
  const [gameDetails, setGameDetails] = useState({});
  const navigate = useNavigate();

  // Immagine di default per l'avatar
  const defaultAvatar = user 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}` 
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  // Username dal signup o fallback
  const username = user?.displayName || user?.email?.split('@')[0] || 'User';

  const fetchGameDetails = async (gameId, includeScreenshots = false) => {
    // Se è un AddFavoriteCard, restituisci immediatamente un oggetto predefinito
    if (typeof gameId === 'string' && gameId.startsWith('add-favorite')) {
      return {
        id: gameId,
        name: 'Add Favorite',
        background_image: null,
        platforms: [],
        rating: null,
        released: null,
        screenshots: []
      };
    }

    try {
      const gameResponse = await axios.get(`${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`);
      const gameDetails = gameResponse.data;

      let screenshotsData = [];
      if (includeScreenshots) {
        const screenshotsResponse = await axios.get(`${RAWG_BASE_URL}/games/${gameId}/screenshots?key=${RAWG_API_KEY}`);
        screenshotsData = screenshotsResponse.data.results.slice(0, 5);
      }

      return {
        ...gameDetails,
        screenshots: screenshotsData
      };
    } catch (error) {
      console.error(`Error fetching game details for ${gameId}:`, error);
      return null;
    }
  };

  const fetchAllGameDetails = async (favouriteGames) => {
    const gameDetailsMap = {};

    for (const game of favouriteGames) {
      // Salta la chiamata API per AddFavoriteCard
      if (typeof game.id === 'string' && game.id.startsWith('add-favorite')) {
        gameDetailsMap[game.id] = {
          [game.id]: {
            details: {
              id: game.id,
              name: 'Add Favorite',
              background_image: null,
              genres: [],
              developers: []
            },
            screenshots: []
          }
        };
        continue;
      }

      try {
        const [detailsResponse, screenshotsResponse] = await Promise.all([
          axios.get(`${RAWG_BASE_URL}/games/${game.id}?key=${RAWG_API_KEY}`),
          axios.get(`${RAWG_BASE_URL}/games/${game.id}/screenshots?key=${RAWG_API_KEY}`)
        ]);
        
        const details = detailsResponse.data;
        const screenshotsData = screenshotsResponse.data.results.slice(0, 5);
        
        gameDetailsMap[game.id] = { 
          [game.id]: {
            details: {
              id: details.id,
              name: details.name,
              background_image: details.background_image,
              genres: details.genres,
              developers: details.developers
            },
            screenshots: screenshotsData
          }
        };
      } catch (error) {
        console.error(`Error fetching game details for ${game.id}:`, error);
        gameDetailsMap[game.id] = null;
      }
    }

    return gameDetailsMap;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000
        }
      }
    ]
  };

  const screenshotSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true
  };

  const groupPlatforms = (platforms) => {
    const groups = {
      playstation: [],
      xbox: [],
      nintendo: [],
      pc: [],
      ios: [],
      android: [],
      linux: [],
      mac: [],
      web: [],
      others: []
    };

    platforms.forEach(({ platform }) => {
      if (platform.slug.includes('playstation')) {
        groups.playstation.push(platform);
      } else if (platform.slug.includes('xbox')) {
        groups.xbox.push(platform);
      } else if (platform.slug.includes('nintendo')) {
        groups.nintendo.push(platform);
      } else if (platform.slug === 'pc') {
        groups.pc.push(platform);
      } else if (platform.slug === 'ios') {
        groups.ios.push(platform);
      } else if (platform.slug === 'android') {
        groups.android.push(platform);
      } else if (platform.slug === 'linux') {
        groups.linux.push(platform);
      } else if (platform.slug === 'mac') {
        groups.mac.push(platform);
      } else if (platform.slug === 'web') {
        groups.web.push(platform);
      } else {
        groups.others.push(platform);
      }
    });

    return Object.entries(groups)
      .filter(([_, platforms]) => platforms.length > 0)
      .map(([key, platforms]) => ({
        slug: key,
        name: platforms.map(p => p.platform.name).join(', ')
      }));
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      // Aggiorna lo stato locale rimuovendo il commento eliminato
      setUserComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentToDelete)
      );
      setShowDeleteModal(false);
      setCommentToDelete(null);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleRemoveFavorite = async (game) => {
    try {
      await toggleFavorite(user.uid, game.details);
      // Aggiorna la lista dei preferiti
      const updatedFavorites = favouriteGames.filter(
        (favorite) => favorite.details.id !== game.details.id
      );
      setFavouriteGames(updatedFavorites);
      
      // Aggiorna anche i giochi recenti se necessario
      const updatedRecent = recentlyAddedGames.filter(
        (recent) => recent.details.id !== game.details.id
      );
      setRecentlyAddedGames(updatedRecent);
      
      toast.success('Game removed from favorites!');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove game from favorites');
    }
  };

  const handleScreenshotNavigation = (gameId, direction) => {
    const gameScreenshots = screenshots[gameId] || [];
    const currentIndex = screenshots[`${gameId}_index`] || 0;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % gameScreenshots.length;
    } else {
      newIndex = (currentIndex - 1 + gameScreenshots.length) % gameScreenshots.length;
    }

    setScreenshots(prev => ({
      ...prev,
      [`${gameId}_index`]: newIndex
    }));
  };

  const getSliderSettings = (itemsCount) => ({
    ...settings,
    infinite: itemsCount > 3,
    slidesToShow: Math.min(3, itemsCount),
    slidesToScroll: 1
  });

  const AddFavoriteCard = () => (
    <Link to="/" className="block h-full">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden h-full cursor-pointer">
        <div className="relative pb-[56.25%] bg-gray-800">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white mb-1">Add Favorite</span>
            <span className="text-sm text-gray-400">Discover new games</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const addedDate = new Date(timestamp);
    return addedDate.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fetchAllData = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch favorite games
      const favorites = await getFavorites(user.uid);
      setFavouriteGames(favorites);

      // Fetch game details for favorites
      const gameDetailsMap = await fetchAllGameDetails(favorites);
      setGameDetails(gameDetailsMap);

      // Fetch user comments
      const comments = await getComments(user.uid);
      setUserComments(comments);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchAllData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchGameDetailsAndScreenshots = async () => {
      const gameDetailsMap = await fetchAllGameDetails(favouriteGames);
      
      setGameDetails(prev => ({...prev, ...Object.fromEntries(
        Object.entries(gameDetailsMap).map(([gameId, data]) => [gameId, data[gameId].details])
      )}));
      
      setScreenshots(prev => ({...prev, ...Object.fromEntries(
        Object.entries(gameDetailsMap).map(([gameId, data]) => [gameId, data[gameId].screenshots])
      )}));
    };

    if (favouriteGames.length > 0) {
      fetchGameDetailsAndScreenshots();
    }
  }, [favouriteGames]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gray-600 hover:bg-gray-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex justify-center items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-8 border-gray-600 border-t-transparent animate-spin"></div>
          <div className="w-24 h-24 rounded-full border-8 border-gray-700 border-t-transparent animate-spin absolute top-0 left-0 animate-ping"></div>
        </div>
      </div>
    );
  }

  const sortedRecentlyAddedGames = [...recentlyAddedGames].sort((a, b) => 
    new Date(b.addedToFavoritesTimestamp) - new Date(a.addedToFavoritesTimestamp)
  );

  const sortedFavouriteGames = [...favouriteGames].sort((a, b) => 
    new Date(a.addedToFavoritesTimestamp) - new Date(b.addedToFavoritesTimestamp)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar
                }}
              />
            ) : (
              <img 
                src={defaultAvatar} 
                alt={username}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{username}</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Link 
            to="/settings" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >
            <FaCog className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Favorite Games
        </h2>

        <div className="px-4 -mx-4">
          <Slider 
            {...getSliderSettings(sortedFavouriteGames.length === 0 ? 3 : sortedFavouriteGames.length)}
            className="space-x-4" 
          >
            {sortedFavouriteGames.map((game) => {
              const isAddFavoriteCard = game && typeof game.id === 'string' && game.id.includes('add-favorite');
              return (
                <div key={game.id || Math.random()} className="px-2">
                  <div className="transition-transform duration-200">
                    {isAddFavoriteCard ? (
                      <AddFavoriteCard />
                    ) : (
                      <GameCard
                        game={game}
                        screenshots={screenshots}
                        toggleFavorite={toggleFavorite}
                        user={user}
                        setFavouriteGames={setFavouriteGames}
                        favouriteGames={favouriteGames}
                        gameDetails={gameDetails}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* Recently Added Games Section */}
      {sortedRecentlyAddedGames.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaClock className="text-blue-500" />
            Recently Added Games
          </h2>

          <div className="px-4 -mx-4">
            <Slider {...getSliderSettings(sortedRecentlyAddedGames.length)}>
              {sortedRecentlyAddedGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game}
                  screenshots={screenshots}
                  toggleFavorite={toggleFavorite}
                  user={user}
                  setRecentlyAddedGames={setRecentlyAddedGames}
                  recentlyAddedGames={recentlyAddedGames}
                  gameDetails={gameDetails}
                />
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {userComments && userComments.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaComment className="text-green-500" />
            Your Comments
          </h2>
          <div className="space-y-4">
            {userComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {comment.gameImage && (
                        <img
                          src={comment.gameImage}
                          alt={comment.gameName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <Link 
                          to={`/game/${comment.gameId}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold block"
                        >
                          {comment.gameName}
                        </Link>
                        <div className="text-sm text-gray-400">
                          Posted on {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-white">{comment.text}</p>
                  </div>
                  {user && user.email === comment.userId && (
                    <button
                      onClick={() => handleDeleteClick(comment.id)}
                      className="text-red-500 hover:text-red-400 transition-colors duration-200 p-2"
                      title="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal di conferma eliminazione */}
      <CommentDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteComment}
      />
    </div>
  );
};

export default Profile;