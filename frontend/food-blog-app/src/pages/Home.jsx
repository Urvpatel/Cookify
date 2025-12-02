import React, { useState } from 'react'
import HeroCarousel from '../components/HeroCarousel'
import RecipeItems from '../components/RecipeItems'
import HomeFeatures from '../components/HomeFeatures'
import { useNavigate, useLoaderData } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const recipes = useLoaderData()

  const addRecipe = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/addRecipe')
    } else {
      setIsOpen(true)
    }
  }

  const goToCommunity = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/favRecipe')
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <section className="home">
        <HeroCarousel
          onPrimaryClick={addRecipe}
          featured={recipes || []}
          onExploreCommunity={goToCommunity}
        />
      </section>
      <HomeFeatures />
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
      <div className="recipe">
        <RecipeItems />
      </div>
    </>
  )
}
