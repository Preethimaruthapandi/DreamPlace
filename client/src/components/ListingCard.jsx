import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

const ListingCard = ({
  listingId,
  creator = {},
  listingPhotoPaths = [],
  city = "",
  province = "",
  country = "",
  category = "",
  type = "",
  price = 0,
  startDate = "",
  endDate = "",
  totalPrice = 0,
  booking = false,
  showDeleteIcon = false, // Prop to control delete icon visibility
  onDelete, // Callback for delete action
}) => {
  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // User Info
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isHost = user?._id === creator._id;
  const isLiked = wishList.some((item) => item?._id === listingId);

  // Navigate to the property details
  const handleCardClick = () => {
    navigate(`/properties/${listingId}`);
  };

  // Add/Remove Wishlist
  const patchWishList = async () => {
    if (!isHost) {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user?._id}/${listingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        dispatch(setWishList(data.wishList));
      } catch (error) {
        console.error("Failed to update wishlist:", error);
      }
    }
  };

  // Slider Navigation
  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      {/* Slider */}
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3001/${photo.replace("public", "")}`}
                alt={`Photo ${index + 1}`}
              />
              <button
                className="prev-button"
                aria-label="Previous Slide"
                onClick={goToPrevSlide}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </button>
              <button
                className="next-button"
                aria-label="Next Slide"
                onClick={goToNextSlide}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Info */}
      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>
      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      {/* Actions */}
      <div className="card-actions">
        {/* Favorite Button */}
        {!isHost && (
          <button
            className="favorite"
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.stopPropagation();
              patchWishList();
            }}
            disabled={!user}
          >
            <Favorite sx={{ color: isLiked ? "red" : "white" }} />
          </button>
        )}

        {/* Delete Button */}
        {showDeleteIcon && (
          <button
            className="delete"
            aria-label="Delete Property"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(listingId);
            }}
          >
            <Delete sx={{ color: "red" }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
