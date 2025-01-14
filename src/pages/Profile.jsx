/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaStar, FaComment, FaTrash, FaClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, toggleFavorite } from '../utils/firebase';
import { getComments, deleteComment } from '../utils/firebaseComments';
import Slider from 'react-slick';
import { toast } from 'react-hot-toast';
import CommentDeleteModal from '../components/Game/CommentDeleteModal';
import GameCard from '../components/Game/GameCard';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SettingsIcon = () => (
    <Link
      to="/settings"
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
      aria-label="Settings"
    >
      <FaCog className="w-6 h-6 text-gray-400" />
    </Link>
  );

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

  const getSliderSettings = (itemsCount) => ({
    ...settings,
    infinite: itemsCount > 3,
    slidesToShow: Math.min(3, itemsCount),
    slidesToScroll: 1
  });

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      // Elimina il commento dal database
      await deleteComment(commentToDelete);
      
      // Aggiorna lo stato locale rimuovendo il commento eliminato
      setUserComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentToDelete)
      );
      
      // Chiudi il modal
      setShowDeleteModal(false);
      setCommentToDelete(null);
      
      // Mostra notifica di successo
      toast.success('Commento eliminato con successo!');
    } catch (error) {
      console.error('Errore durante l\'eliminazione del commento:', error);
      toast.error(error.message || 'Impossibile eliminare il commento');
    }
  };

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

  const renderFavoriteGamesContent = () => {
    return (
      <div>
        {sortedFavouriteGames.length === 0 ? (
          <div className="px-4 -mx-4">
            <Slider 
              {...getSliderSettings(3)}
              className="space-x-4" 
            >
              {[1, 2, 3].map((_, index) => (
                <div key={`add-favorite-${index}`} className="px-2">
                  <div className="transition-transform duration-200">
                    <AddFavoriteCard />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="px-4 -mx-4">
            <Slider 
              {...getSliderSettings(sortedFavouriteGames.length + 1)}
              className="space-x-4" 
            >
              {[...sortedFavouriteGames, { id: 'add-favorite-1' }].map((game) => {
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
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch Favorites
        const favorites = await getFavorites(user.uid);
        
        if (favorites && favorites.length > 0) {
          // Sort favorites by date added
          const sortedFavorites = [...favorites].sort(
            (a, b) => b.dateAdded - a.dateAdded
          );

          // Fetch game details for favorites
          const gamesWithDetails = await Promise.all(
            sortedFavorites.map(async (favorite) => {
              const details = await fetchGameDetails(favorite.gameId, true);
              
              return {
                ...details,
                gameId: favorite.gameId,
                addedAt: favorite.addedAt || new Date().toISOString()
              };
            })
          );

          // Set recently added games (first 5 different from favorites)
          const recentlyAdded = gamesWithDetails.filter(game => 
            !favouriteGames.some(favGame => favGame.id === game.id)
          ).slice(0, 5);
          setRecentlyAddedGames(recentlyAdded);
          
          // Set favorite games, con un solo AddFavoriteCard se ci sono 3 o più giochi
          setFavouriteGames(
            gamesWithDetails.length < 3 
              ? [
                ...gamesWithDetails,
                { id: 'add-favorite-1' },
                { id: 'add-favorite-2' }
              ].slice(0, 3)
              : [
                ...gamesWithDetails,
                { id: 'add-favorite-1' }
              ].slice(0, 4)
          );
        } else {
          // If no favorites, set default state with 3 AddFavoriteCard
          setRecentlyAddedGames([]);
          setFavouriteGames([
            { id: 'add-favorite-1' },
            { id: 'add-favorite-2' },
            { id: 'add-favorite-3' }
          ]);
        }

        // Fetch User Comments
        const comments = await getComments(user.email);
        const commentsWithGameDetails = await Promise.all(
          comments.map(async (comment) => {
            const gameDetails = await fetchGameDetails(comment.gameId, false);
            return {
              ...comment,
              gameName: gameDetails?.name || 'Unknown Game',
              gameImage: gameDetails?.background_image || null
            };
          })
        );
        setUserComments(commentsWithGameDetails);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

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

  const sortedRecentlyAddedGames = [...recentlyAddedGames].sort((a, b) => 
    new Date(b.addedToFavoritesTimestamp) - new Date(a.addedToFavoritesTimestamp)
  );

  const sortedFavouriteGames = [...favouriteGames].sort((a, b) => 
    new Date(a.addedToFavoritesTimestamp) - new Date(b.addedToFavoritesTimestamp)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-12 flex flex-col items-center justify-center space-y-2">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2">
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{username}</h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
        <SettingsIcon />
      </div>

      {/* Favorites Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Favorite Games
        </h2>
        {renderFavoriteGamesContent()}
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
                  <button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="text-red-500 hover:text-red-400 transition-colors duration-200 p-2"
                    title="Delete comment"
                  >
                    <FaTrash />
                  </button>
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