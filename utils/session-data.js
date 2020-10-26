/**
 *
 * @param {Object} user - object containing the user data
 *                 to associate with a new session
 * @description    extracts the data from the user object and
 *                 creates a new object that represents the session
 *                 data for the current user. The session data is
 *                 then ready to be stored in the database
 * @return         returns an object representing the data defining
 *                 the current users session
 */
const setSessionData = user => {
    return {
        userId: user.id,
        email: user.email,
        isLoggedIn: user.isLoggedIn
    };
};

module.exports = setSessionData;
