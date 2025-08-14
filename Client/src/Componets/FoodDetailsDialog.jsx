import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect } from 'react';

export const FoodDetailsDialog = ({ food, isOpen, onClose }) => {
  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('dialog-open');
    } else {
      document.body.classList.remove('dialog-open');
    }
    
    return () => {
      document.body.classList.remove('dialog-open');
    };
  }, [isOpen]);

  if (!food) return null;

  // Helper function to find a nutrient by name
  const getNutrient = (name) => {
    return food.foodNutrients?.find(n => 
      n.nutrientName.toLowerCase().includes(name.toLowerCase())
    ) || { value: 'N/A', unitName: '' };
  };

  // Main nutrients
  const calories = getNutrient('Energy');
  const protein = getNutrient('Protein');
  const carbs = getNutrient('Carbohydrate');
  const fats = getNutrient('Total lipid');
  const fiber = getNutrient('Fiber');
  const sugar = getNutrient('Sugars');

  // Vitamins and Minerals
  const vitaminsAndMinerals = [
    { name: 'Vitamin B1', search: 'Thiamin' },
    { name: 'Vitamin B2', search: 'Riboflavin' },
    { name: 'Vitamin B3', search: 'Niacin' },
    { name: 'Vitamin B5', search: 'Pantothenic acid' },
    { name: 'Vitamin B6', search: 'Vitamin B6' },
    { name: 'Vitamin B7', search: 'Biotin' },
    { name: 'Vitamin B9', search: 'Folate' },
    { name: 'Vitamin B12', search: 'Vitamin B12' },
    { name: 'Vitamin C', search: 'Vitamin C' },
    { name: 'Vitamin D', search: 'Vitamin D' },
    { name: 'Vitamin E', search: 'Vitamin E' },
    { name: 'Vitamin K', search: 'Vitamin K' },
    { name: 'Calcium', search: 'Calcium' },
    { name: 'Copper', search: 'Copper' },
    { name: 'Iron', search: 'Iron' },
    { name: 'Magnesium', search: 'Magnesium' },
    { name: 'Manganese', search: 'Manganese' },
    { name: 'Phosphorus', search: 'Phosphorus' },
    { name: 'Potassium', search: 'Potassium' },
    { name: 'Selenium', search: 'Selenium' },
    { name: 'Sodium', search: 'Sodium' },
    { name: 'Zinc', search: 'Zinc' }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[1001]">
      <div className="dialog-overlay">
        <DialogPanel className="dialog-content">
          <DialogTitle className="text-xl font-bold mb-4">{food.description}</DialogTitle>
          
          <div className="">
            <div className="nutrient-section">
              <h3 className="">Macronutrients</h3>
              <div className="">
                <p>Calories: {calories.value} {calories.unitName}</p>
                <p>Protein: {protein.value} {protein.unitName}</p>
                <p>Carbs: {carbs.value} {carbs.unitName}</p>
                <p>Fats: {fats.value} {fats.unitName}</p>
                <p>Fiber: {fiber.value} {fiber.unitName}</p>
                <p>Sugar: {sugar.value} {sugar.unitName}</p>
              </div>
            </div>

            <div className="nutrient-section">
              <h3 className="">Vitamins & Minerals</h3>
              <div className="">
                {vitaminsAndMinerals.map((item, index) => {
                  const nutrient = getNutrient(item.search);
                  return (
                    <p key={index}>
                      {item.name}: {nutrient.value} {nutrient.unitName}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="">
            <button>Save</button>
            <button
              onClick={onClose}
              className=""
            >
              Close
            </button>
            
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};