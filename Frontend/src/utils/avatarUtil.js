/**
 * Default avatar utility for Bloggify
 * Uses the Avatar Placeholder API
 */

// Default avatar from the API
export const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public';

// Get a random avatar
export const getRandomAvatar = () => {
  return `${DEFAULT_AVATAR}?t=${new Date().getTime()}`;
};

// Get a specific avatar by ID (1-24)
export const getAvatarById = (id) => {
  // Ensure ID is between 1-24
  const avatarId = Math.min(Math.max(parseInt(id) || 1, 1), 24);
  return `${DEFAULT_AVATAR}/${avatarId}`;
};

// Create array of all available avatars
export const getAllAvatars = () => {
  const avatars = [];
  for (let i = 1; i <= 24; i++) {
    avatars.push({
      id: i,
      url: getAvatarById(i)
    });
  }
  return avatars;
};