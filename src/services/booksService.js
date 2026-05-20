import booksData from "../data/books.json";

// Retorna a lista completa de livros
export const getAllBooks = () => {
    return booksData || [];
};

// Busca um único livro por ID (p/ BookPage)
export const getBookById = (id) => {
    if (!id) return null;
    return booksData.find((book) => String(book.id) === String(id));
};

// Filtra bestseller
export const getBestSellers = () => {
    return booksData.filter(book => book.isBestSeller);
};

// Filtra laançamentos
export const getNewBooks = () => {
    return booksData.filter(book => book.isNew);
};

// Filtra livros com desconto 
export const getLowPrices = () => {
    return booksData.filter(book => book.discount > 0);
};