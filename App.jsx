import React, { useState, useEffect } from 'react';
import './App.css';
import burgerImg from "./assets/burger.avif";
import notesImg from "./assets/Notes.png";

function App() {
  const [recipes, setRecipes] = useState(() => {
    // Load recipes from localStorage on initial render
    const savedRecipes = localStorage.getItem('recipe-app-recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({
    id: null,
    name: '',
    ingredients: '',
    description: ''
  });

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('recipe-app-recipes', JSON.stringify(recipes));
  }, [recipes]);

  // When component mounts, try to select the first recipe if available
  useEffect(() => {
    if (recipes.length > 0 && !selectedRecipe) {
      setSelectedRecipe(recipes[0]);
    }
  }, [recipes, selectedRecipe]);

  const openModal = (recipe = { id: null, name: '', ingredients: '', description: '' }) => {
    setCurrentRecipe(recipe);
    setEditMode(!!recipe.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentRecipe({ id: null, name: '', ingredients: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecipe(prev => ({ ...prev, [name]: value }));
  };

  const saveRecipe = () => {
    if (!currentRecipe.name.trim()) return;

    if (editMode) {
      const updatedRecipes = recipes.map(r => r.id === currentRecipe.id ? currentRecipe : r);
      setRecipes(updatedRecipes);
      setSelectedRecipe(currentRecipe);
    } else {
      const newRecipe = { 
        ...currentRecipe, 
        id: Date.now() 
      };
      const updatedRecipes = [...recipes, newRecipe];
      setRecipes(updatedRecipes);
      setSelectedRecipe(newRecipe);
    }
    closeModal();
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter(r => r.id !== id);
    setRecipes(updatedRecipes);
    
    // If we're deleting the selected recipe, select another one or clear selection
    if (selectedRecipe && selectedRecipe.id === id) {
      if (updatedRecipes.length > 0) {
        setSelectedRecipe(updatedRecipes[0]);
      } else {
        setSelectedRecipe(null);
      }
    }
  };

  const renderList = (text) => {
    if (!text.trim()) return null;
    
    const items = text.split(/\*|\n/).filter(item => item.trim());
    
    return (
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item.trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Recipe's List</h2>
          <button className="add-icon-btn" onClick={() => openModal()}>+</button>
        </div>

        <div className="recipe-list">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <div
                key={recipe.id}
                className={`recipe-item ${selectedRecipe?.id === recipe.id ? 'selected' : ''}`}
                onClick={() => setSelectedRecipe(recipe)}
              >
                {recipe.name}
              </div>
            ))
          ) : (
            <div className="empty-list-placeholder">
              <img 
                src={notesImg}  
                alt="No recipes yet" 
                style={{ width: '150px', height: 'auto', display: 'block', margin: '40px auto 20px' }} 
              />
            </div>
          )}
          
          {/* Show Add Recipe button ONLY when there are NO recipes */}
          {recipes.length === 0 && (
            <div className="add-recipe-bottom">
              <button className="add-recipe-btn" onClick={() => openModal()}>
                Add Recipe
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="main">
        {selectedRecipe ? (
          <div className="details">
            <div className="details-header">
              <h3>{selectedRecipe.name}'s Recipe</h3>
              <div className="actions">
                {/* Edit Icon Button */}
                <button className="icon-btn edit-icon" onClick={() => openModal(selectedRecipe)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3333 2.00001C11.5083 1.82502 11.7162 1.68691 11.945 1.59331C12.1738 1.49971 12.419 1.45251 12.6667 1.45435C12.9143 1.4562 13.159 1.50705 13.3863 1.60399C13.6137 1.70092 13.8191 1.84197 13.9907 2.01876C14.1623 2.19556 14.2966 2.40453 14.3856 2.63312C14.4745 2.86171 14.5162 3.10527 14.5083 3.34979C14.5004 3.59431 14.443 3.83469 14.3394 4.05678C14.2358 4.27887 14.0881 4.478 13.9053 4.64201L6.528 12L2.66667 12.6667L3.33333 8.80401L10.7107 1.44734C10.8733 1.28468 11.0707 1.16068 11.288 1.08401L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Delete Icon Button */}
                <button className="icon-btn delete-icon" onClick={() => deleteRecipe(selectedRecipe.id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.33325 4V2.66667C5.33325 2.31305 5.47373 1.97391 5.72378 1.72386C5.97383 1.47381 6.31296 1.33334 6.66659 1.33334H9.33325C9.68688 1.33334 10.026 1.47381 10.2761 1.72386C10.5261 1.97391 10.6666 2.31305 10.6666 2.66667V4M12.6666 4V13.3333C12.6666 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97383 14.5262 3.72378 14.2761C3.47373 14.0261 3.33325 13.687 3.33325 13.3333V4H12.6666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66675 7.33334V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.33325 7.33334V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="details-content">
              <h4>Ingredients</h4>
              {renderList(selectedRecipe.ingredients) || <p>No ingredients added</p>}

              <h4>Directions</h4>
              {renderList(selectedRecipe.description) || <p>No directions added</p>}
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <img 
              src={burgerImg} 
              alt="Select a recipe illustration" 
              style={{ width: '280px', height: 'auto', marginBottom: '20px' }} 
            />
            <p>{recipes.length > 0 ? 'Select a recipe for details!' : 'Add your first recipe!'}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editMode ? 'Edit Recipe' : 'Add Recipe'}
              </div>
              <button className="modal-close-btn" onClick={closeModal} title="Close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <label>Recipe Name</label>
              <input
                type="text"
                name="name"
                value={currentRecipe.name}
                onChange={handleChange}
                placeholder="Enter the recipe's name"
              />
              <div className="container">
                <div className="container-left">
                  <label>Recipe Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={currentRecipe.ingredients}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Enter each ingredient separated by asterisk. For ex: 1 tablespoon sugar * 2 tablespoons honey"
                  />
                </div>
                
                <div className="container-right"> 
                  <label>Recipe Description</label>
                  <textarea
                    name="description"
                    value={currentRecipe.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Enter each step separated by asterisk. For ex: Boil water for 5 mins. * Add sugar."
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={saveRecipe} className="save-btn">
                {editMode ? 'Edit Recipe' : 'Add Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;