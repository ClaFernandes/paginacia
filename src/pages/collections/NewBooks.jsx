import CollectionPage from "./CollectionPage";
import { getNewBooks } from "../../services/booksService";

const NewBooks = () => <CollectionPage title="Lançamentos" fetchFunction={getNewBooks} />;
export default NewBooks;