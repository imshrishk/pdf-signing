import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import styled from "styled-components";
import { URL } from "../url";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const DateHeading = styled.h2`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const NutritionCard = styled.div`
  background-color: #fff;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NutritionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NutritionItem = styled.li`
  background-color: #f1f1f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
`;

const ViewNutrition = () => {
  const { user } = useContext(UserContext);
  const [nutritions, setNutritions] = useState([]);
  const [openDates, setOpenDates] = useState({});
  
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const response = await axios.get(`${URL}/userCalories`, {
          withCredentials: true,
        });
        setNutritions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNutrition();
  }, [user]);
  
  const handleToggleDate = (date) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };
  
  const nutritionByDate = nutritions.reduce((acc, nutrition) => {
    const date = new Date(nutrition.timeOfMeal).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(nutrition);
    return acc;
  }, {});

  const sortedDates = Object.keys(nutritionByDate).sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order
  
  return (
    <Container>
      {sortedDates.length === 0 ? (
        <div>No tracked food found</div>
      ) : (
        sortedDates.map((date) => (
          <div key={date}>
            <DateHeading onClick={() => handleToggleDate(date)}>
              {date}
            </DateHeading>
            {openDates[date] && (
              <ul>
                {nutritionByDate[date].map((nutrition) => (
                  <NutritionCard key={nutrition._id}>
                    <h3>{nutrition.itemName}</h3>
                    <NutritionList>
                      <NutritionItem>
                        <p>Quantity: {nutrition.itemQuantity}</p>
                        <p>Calories: {nutrition.calories}</p>
                        <p>Meal Type: {nutrition.mealType}</p>
                        <p>Time of Meal: {new Date(nutrition.timeOfMeal).toLocaleString()}</p>
                      </NutritionItem>
                    </NutritionList>
                  </NutritionCard>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </Container>
  );
};

export default ViewNutrition;
