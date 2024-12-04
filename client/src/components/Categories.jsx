import { categories } from "../data";
import "../styles/Categories.scss"
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Discover Your Perfect Escape</h1>
      <p>
      Browse our diverse collection of vacation rentals tailored to every traveler. Experience local charm, unwind in cozy comforts, and craft unforgettable moments in your ideal getaway destination.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 11).map((category, index) => (
          <Link to={`/properties/category/${category.label}`}>
            <div className="category" key={index}>
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;