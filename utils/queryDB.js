const db = require("../db/connect");

// Function to get books from wishlist with distance greater than 10 km
async function getBooksInWishlist(userId, bookTitle) {
  const query = `
  WITH user_location AS (
      SELECT lat, lng
      FROM users
      WHERE user_id = $1
  ),
  wishlisted_books AS (
      SELECT w.wishlist_id, b.title, b.isbn, u.lat AS user_lat, u.lng AS user_lng, u.email AS user_email, w.radius
      FROM wishlists w
      JOIN books b ON w.book_id = b.book_id
      JOIN users u ON w.user_id = u.user_id
      WHERE b.title ILIKE $2
  ),
  distance_calculated AS (
      SELECT wb.*, 
             3959 * 2 * ASIN(
                 SQRT(
                     POWER(SIN((user_location.lat - wb.user_lat) * PI() / 180 / 2), 2) +
                     COS(user_location.lat * PI() / 180) * COS(wb.user_lat * PI() / 180) *
                     POWER(SIN((user_location.lng - wb.user_lng) * PI() / 180 / 2), 2)
                 )
             ) AS distance
      FROM wishlisted_books wb
      CROSS JOIN user_location
  )
  SELECT title, isbn, user_email, distance
  FROM distance_calculated
  WHERE distance <= radius; -- Use the wishlist's radius to filter results
`;

  try {
    // Connect to the database and execute the query
    const result = await db.query(query, [userId, bookTitle]);

    console.log(result.rows);

    // Return the result rows
    return result.rows.map((row) => {
      return { email: row.user_email, distance: row.distance };
    });
  } catch (err) {
    // Handle any errors that occurred during the query
    console.error("Error executing query:", err.stack);
    throw err;
  }
}

// Example usage
const userId = 53; // Replace with actual user ID
const bookTitle = "Harry Potter and the Goblet of Fire"; // Replace with actual book title

// getBooksInWishlist(userId, bookTitle, 10)
//   .then((books) => {
//     // Do something with the retrieved books
//     console.log(books);
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });

module.exports = getBooksInWishlist;
