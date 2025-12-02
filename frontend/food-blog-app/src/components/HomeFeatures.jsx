import React from 'react'
import { BsClock, BsBookmarkHeart, BsShare } from 'react-icons/bs'
import { FaUtensils, FaUsers, FaFire } from 'react-icons/fa'

export default function HomeFeatures() {
  return (
    <>
      <section className="home-features">
        <div className="features-container">
          <h2 className="features-title">Why Cookify?</h2>
          <p className="features-subtitle">Everything you need to discover, save, and share amazing recipes.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <BsClock />
              </div>
              <h3>Quick & Easy</h3>
              <p>Find recipes that fit your schedule. Filter by prep time and get cooking in minutes.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BsBookmarkHeart />
              </div>
              <h3>Save Favorites</h3>
              <p>Bookmark your go-to recipes and build a personal collection you can access anytime.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BsShare />
              </div>
              <h3>Share Your Creations</h3>
              <p>Turn your favorite dishes into recipes and share them with the community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              <FaUtensils />
            </div>
            <div className="stat-content">
              <h3>1000+</h3>
              <p>Recipes</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>500+</h3>
              <p>Home Cooks</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <FaFire />
            </div>
            <div className="stat-content">
              <h3>Daily</h3>
              <p>New Recipes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-how-it-works">
        <div className="how-container">
          <h2 className="how-title">How It Works</h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-number">1</div>
              <h3>Browse Recipes</h3>
              <p>Explore our collection of recipes from home cooks around the world.</p>
            </div>
            
            <div className="how-step">
              <div className="how-number">2</div>
              <h3>Save Your Favorites</h3>
              <p>Click the heart icon to bookmark recipes you want to try later.</p>
            </div>
            
            <div className="how-step">
              <div className="how-number">3</div>
              <h3>Share Your Own</h3>
              <p>Create an account and share your own delicious recipes with the community.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}




