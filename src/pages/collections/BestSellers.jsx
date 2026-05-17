import CollectionPage from "./CollectionPage";
import { getBestSellers } from "../../services/booksService";

const BestSellers = () => <CollectionPage title="Mais Vendidos" fetchFunction={getBestSellers} />;
export default BestSellers;