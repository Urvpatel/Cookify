import React, { useEffect, useMemo, useState } from 'react'
import foodRecipe from '../assets/foodRecipe.png'

export default function HeroCarousel({ onPrimaryClick, featured = [], onExploreCommunity }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = useMemo(() => {
    if (!featured || featured.length === 0) {
      return [
        {
          badge: 'Cookify • Featured',
          title: 'Turn cravings into colourful recipes.',
          subtitle:
            'Mix, match, and remix dishes from food lovers around the world. Tap a card to start tasting.',
          coverImage: null,
          tag: '✨ Brand new',
        },
      ]
    }
    const take = featured.slice(0, 5)
    return take.map((recipe, idx) => ({
      badge: idx === 0 ? '🥄 Featured spoonful' : idx === 1 ? '🔥 Today’s crush' : '⭐ Community pick',
      title: recipe.title,
      subtitle: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.slice(0, 3).join(' • ')
        : 'Saved from the Cookify community.',
      coverImage: recipe.coverImage,
      tag: idx === 0 ? 'New & shiny' : 'Loved this week',
    }))
  }, [featured])

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const current = slides[activeIndex] || slides[0]

  return (
    <div className="hero-shell">
      <div className="hero-content">
        <div className="hero-badge">
          <span>🍽 Cookify Playground</span>
          <span>•</span>
          <span>{current.badge}</span>
        </div>
        <h1 className="hero-title">
          Save your
          <span className="hero-title-highlight"> yummiest ideas</span>
          , forever.
        </h1>
        <p className="hero-subtitle">{current.subtitle}</p>

        <div className="hero-actions">
          <button onClick={onPrimaryClick} className="hero-primary">
            <span>+ Drop a new recipe</span>
          </button>
          <button
            type="button"
            className="hero-secondary"
            onClick={onExploreCommunity}
          >
            <span className="hero-secondary-dot" />
            <span>Explore community picks</span>
          </button>
        </div>
      </div>

      <div className="hero-carousel">
        <div className="hero-image-shell">
          <img
            src={
              current.coverImage
                ? `http://localhost:5000/images/${current.coverImage}`
                : foodRecipe
            }
            alt={current.title}
          />
          <div className="hero-image-overlay">
            <span className="hero-pill">
              ⏱ Under 30 mins
            </span>
            <span className="hero-pill alt">
              ✨ {current.tag}
            </span>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

