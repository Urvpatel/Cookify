import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa6'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export default function RecipeCard({
  recipe,
  isMyRecipe,
  isFavourite,
  onToggleFavourite,
  onDelete,
}) {
  const navigate = useNavigate()

  const tagline = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.slice(0, 2).join(' • ')
    : ''

  return (
    <div
      className="card"
      onDoubleClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      <img
        src={`http://localhost:5000/images/${recipe.coverImage}`}
        alt={recipe.title}
      />
      <div className="card-body">
        {!isMyRecipe && isFavourite && (
          <span className="card-fav-badge">
            <span>💖</span>
            <span>Favourite</span>
          </span>
        )}
        <div className="title">{recipe.title}</div>
        {tagline && <p className="card-tagline">{tagline}</p>}
        <div className="icons">
          <div className="timer">
            <BsStopwatchFill />
            {recipe.time}
          </div>
          {!isMyRecipe ? (
            <FaHeart
              onClick={onToggleFavourite}
              className={`favorite-heart ${isFavourite ? 'favorited' : ''}`}
              style={{ 
                color: isFavourite ? '#ef4444' : '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.5rem'
              }}
              title={isFavourite ? 'Remove from favorites' : 'Add to favorites'}
            />
          ) : (
            <div className="action">
              <Link to={`/editRecipe/${recipe._id}`} className="editIcon">
                <FaEdit />
              </Link>
              <MdDelete onClick={onDelete} className="deleteIcon" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

