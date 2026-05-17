import CollectionPage from "./CollectionPage";
import { getLowPrices } from "../../services/booksService";

const LowPrices = () => (
  <CollectionPage title="Promoções" fetchFunction={getLowPrices} />
);
export default LowPrices;
