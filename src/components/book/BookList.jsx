import "./BookList.css";
import BookItem from "./BookItem";

const BookList = ({ books, onAddToCart, onToggleFavorite }) => {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookItem
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          price={book.price}
          image={book.image}
          discount={book.discount}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default BookList;