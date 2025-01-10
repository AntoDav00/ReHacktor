import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaStar, FaComment, FaTrash, FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, toggleFavorite } from '../utils/firebase';
import { getComments, deleteComment } from '../utils/firebaseComments';
import LoadingSkeleton from '../components/Features/LoadingSkeleton';
import PlatformIcon from '../components/Features/PlatformIcon';
import Slider from 'react-slick';
import { toast } from 'react-hot-toast';
import CommentDeleteModal from '../components/Game/CommentDeleteModal';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [favouriteGames, setFavouriteGames] = useState([]);
  const [recentlyAddedGames, setRecentlyAddedGames] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Immagine di default per l'avatar
  const defaultAvatar = user 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}` 
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  // Username dal signup o fallback
  const username = user?.displayName || user?.email?.split('@')[0] || 'User';

  const [gameDetails, setGameDetails] = useState({});

  const fetchGameDetails = async (gameId, fullDetails = false) => {
    if (!gameId) return null;
    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
      );
      const data = await response.json();

      if (fullDetails) {
        // Fetch screenshots for hover effect
        const screenshotsResponse = await fetch(
          `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`
        );
        const screenshotsData = await screenshotsResponse.json();

        return {
          ...data,
          screenshots: screenshotsData.results || []
        };
      }

      // Return basic details for comments
      return {
        name: data.name,
        image: data.background_image,
        id: data.id
      };
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
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
        name: platforms.map(p => p.name).join(', ')
      }));
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      await deleteComment(commentToDelete);
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

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await getComments();
        const userComments = comments.filter(
          (comment) => comment.userId === user.email
        );
        
        // Fetch basic game details for comments
        const commentsWithGameDetails = await Promise.all(
          userComments.map(async (comment) => {
            const gameDetails = await fetchGameDetails(comment.gameId, false);
            return {
              ...comment,
              gameName: gameDetails?.name || 'Unknown Game',
              gameImage: gameDetails?.image || null
            };
          })
        );
        
        setUserComments(commentsWithGameDetails);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };

    if (user) {
      loadComments();
    }
  }, [user]);

  useEffect(() => {
    const fetchRecentlyAddedGames = async () => {
      if (user) {
        try {
          const favorites = await getFavorites(user.uid);
          if (favorites && favorites.length > 0) {
            // Sort by dateAdded in descending order
            const sortedFavorites = [...favorites].sort(
              (a, b) => b.dateAdded - a.dateAdded
            );
            
            // Take only the first 5 games
            const recentFavorites = sortedFavorites.slice(0, 5);
            
            // Fetch full game details for recently added games
            const recentGamesWithDetails = await Promise.all(
              recentFavorites.map(async (favorite) => {
                const details = await fetchGameDetails(favorite.gameId, true);
                return {
                  ...favorite,
                  details
                };
              })
            );
            
            setRecentlyAddedGames(recentGamesWithDetails);
          }
        } catch (error) {
          console.error('Error fetching recently added games:', error);
        }
      }
    };

    fetchRecentlyAddedGames();
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const favorites = await getFavorites(user.uid);
          if (favorites) {
            // Fetch full game details for favorite games
            const gamesWithDetails = await Promise.all(
              favorites.map(async (favorite) => {
                const details = await fetchGameDetails(favorite.gameId, true);
                return {
                  ...favorite,
                  details
                };
              })
            );
            setFavouriteGames(gamesWithDetails);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const favorites = await getFavorites(user.uid);
          if (favorites) {
            // Fetch full game details for favorite games
            const gamesWithDetails = await Promise.all(
              favorites.map(async (favorite) => {
                const details = await fetchGameDetails(favorite.gameId, true);
                return {
                  ...favorite,
                  details
                };
              })
            );
            setFavouriteGames(gamesWithDetails);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
          <div className="w-24 h-24 rounded-full border-8 border-purple-400 border-t-transparent animate-spin"></div>
          <div className="w-24 h-24 rounded-full border-8 border-pink-400 border-t-transparent animate-spin absolute top-0 left-0 animate-ping"></div>
        </div>
      </div>
    );
  }

  const AddFavoriteCard = () => (
    <Link to="/" className="block h-full">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden h-full group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="relative pb-[56.25%] bg-gradient-to-br from-purple-400/20 to-pink-400/20">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 flex items-center justify-center group-hover:from-purple-400/40 group-hover:to-pink-400/40 transition-colors duration-300">
              <svg 
                className="w-8 h-8 text-white group-hover:text-purple-100 transition-colors duration-300" 
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
            <span className="text-xl font-bold text-white mb-1 group-hover:text-purple-100">Add Favorite</span>
            <span className="text-sm text-purple-200">Discover new games</span>
          </div>
          {/* Effetto overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </Link>
  );

  const getSliderSettings = (itemsCount) => ({
    ...settings,
    infinite: itemsCount > 3,
    slidesToShow: Math.min(3, itemsCount),
    slidesToScroll: 1
  });

  const GameCard = ({ game }) => {
    return (
      <Link to={`/game/${game.details.id}`} className="block">
        <div className="relative group">
          <img
            src={game.details.background_image}
            alt={game.details.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-white font-semibold">{game.details.name}</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFavorite(game);
                }}
                className="text-red-500 hover:text-red-400 transition-colors duration-200"
                title="Remove from favorites"
              >
                <FaHeart className="w-5 h-5" />
              </button>
            </div>
            
            {/* Screenshots */}
            {game.details.screenshots && game.details.screenshots.length > 0 && (
              <div className="mt-2">
                <div className="flex space-x-2 overflow-x-auto">
                  {game.details.screenshots.slice(0, 3).map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot.image}
                      alt={`Screenshot ${index + 1}`}
                      className="w-20 h-12 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Platforms and Genres */}
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {game.details.platforms?.map((platform) => (
                  <PlatformIcon
                    key={platform.platform.id}
                    platform={platform.platform.name}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {game.details.genres?.map(genre => genre.name).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

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
        <Link 
          to="/settings" 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
        >
          <FaCog className="w-6 h-6 text-gray-400" />
        </Link>
      </div>

      {/* Favorites Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Favorite Games
        </h2>

        <div className="px-4 -mx-4">
          <Slider {...settings}>
            {/* Giochi preferiti */}
            {favouriteGames.map((game) => (
              <div key={game.gameId} className="px-2">
                <Link to={`/game/${game.gameId}`}>
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="relative pb-[56.25%]">
                      {game.details?.screenshots?.length > 0 ? (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Slider {...screenshotSettings}>
                            {game.details.screenshots.map((screenshot, index) => (
                              <div key={index} className="relative pb-[56.25%]">
                                <img
                                  src={screenshot.image}
                                  alt={`${game.gameName} screenshot ${index + 1}`}
                                  className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </Slider>
                        </div>
                      ) : null}
                      <img
                        src={game.gameImage}
                        alt={game.gameName}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300" />
                      
                      {/* Bottone rimozione preferiti */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFavorite(game);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 z-10"
                        title="Remove from favorites"
                      >
                        <FaHeart className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold truncate mb-2">{game.gameName}</h3>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-sm">Rating: {game.rating}</p>
                          <div className="flex items-center space-x-2">
                            {game.details?.platforms ? 
                              groupPlatforms(game.details.platforms).map((platform) => (
                                <span key={platform.slug} 
                                      className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                                      title={platform.name}>
                                  <PlatformIcon 
                                    platform={platform.slug} 
                                    className="w-3.5 h-3.5" 
                                  />
                                </span>
                              ))
                            : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {game.details?.genres?.map((genre) => (
                            <span key={genre.id} className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Card "Add Favorite" per riempire lo slider */}
            {favouriteGames.length < 3 && [...Array(3 - favouriteGames.length)].map((_, index) => (
              <div key={`add-favorite-${index}`} className="px-2">
                <AddFavoriteCard />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Recently Added Games Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Recently Added Games
        </h2>

        <div className="px-4 -mx-4">
          <Slider {...settings}>
            {/* Giochi recenti */}
            {recentlyAddedGames.map((game) => (
              <div key={game.gameId} className="px-2">
                <Link to={`/game/${game.gameId}`}>
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="relative pb-[56.25%]">
                      {game.details?.screenshots?.length > 0 ? (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Slider {...screenshotSettings}>
                            {game.details.screenshots.map((screenshot, index) => (
                              <div key={index} className="relative pb-[56.25%]">
                                <img
                                  src={screenshot.image}
                                  alt={`${game.gameName} screenshot ${index + 1}`}
                                  className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </Slider>
                        </div>
                      ) : null}
                      <img
                        src={game.gameImage}
                        alt={game.gameName}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300" />
                      
                      {/* Bottone rimozione preferiti */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFavorite(game);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 z-10"
                        title="Remove from favorites"
                      >
                        <FaHeart className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold truncate mb-2">{game.gameName}</h3>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-sm">Added: {new Date(game.addedAt).toLocaleDateString()}</p>
                          <div className="flex items-center space-x-2">
                            {game.details?.platforms ? 
                              groupPlatforms(game.details.platforms).map((platform) => (
                                <span key={platform.slug} 
                                      className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 transition-colors duration-200"
                                      title={platform.name}>
                                  <PlatformIcon 
                                    platform={platform.slug} 
                                    className="w-3.5 h-3.5" 
                                  />
                                </span>
                              ))
                            : null}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {game.details?.genres?.map((genre) => (
                            <span key={genre.id} className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Card "Add Favorite" per riempire lo slider */}
            {recentlyAddedGames.length < 3 && [...Array(3 - recentlyAddedGames.length)].map((_, index) => (
              <div key={`add-recent-${index}`} className="px-2">
                <AddFavoriteCard />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaComment className="text-blue-500" />
          Your Comments
        </h2>
        <div className="grid gap-4">
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
          {userComments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              You haven't posted any comments yet.
            </div>
          )}
        </div>
      </div>

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
