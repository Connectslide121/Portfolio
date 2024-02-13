import componentsIso from "../images/components-iso.png";
import components from "../images/components.png";
import productsIso from "../images/products-iso.png";
import products from "../images/products.png";
import shoppingIso from "../images/shopping-iso.png";
import shopping from "../images/shopping.png";

export function cardHover() {
  return (
    <div className="home-cards-wrapper">
      <div className="home-card">
        <div className="home-image-wrapper">
          <img src={componentsIso} alt="UI" className="home-image" />
        </div>
        <img src={components} alt="" className="card" />
      </div>
      <div className="home-card">
        <div className="home-image-wrapper">
          <img src={productsIso} alt="UI" className="home-image" />
        </div>
        <img src={products} alt="" className="card" />
      </div>
      <div className="home-card">
        <div className="home-image-wrapper">
          <img src={shoppingIso} alt="UI" className="home-image" />
        </div>
        <img src={shopping} alt="" className="card" />
      </div>
    </div>
  );
}
