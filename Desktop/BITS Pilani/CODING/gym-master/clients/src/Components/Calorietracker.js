import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

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

const Form = styled.form`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  flex: 1;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  display: inline-block;
  margin: 10px 5px;
  padding: 10px 15px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;

const CalorieTracker = () => {
  const { user } = useContext(UserContext);
  const [nutritions, setNutritions] = useState([]);
  const [showNutrition, setShowNutrition] = useState(false);
  const navigate = useNavigate();
  const [nutritionEntry, setNutritionEntry] = useState({
    itemName: "",
    itemQuantity: 0,
    calories: 0,
    mealType: "breakfast", // default value
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNutritionEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${URL}/addCalorie`,
        {
          ...nutritionEntry,
          user: user.id,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setNutritions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewPastDay = async () => {
    setShowNutrition((prev) => !prev);  // Toggle the state

    if (!showNutrition) {  // Fetch data only if toggling to show
      try {
        const response = await axios.get(`${URL}/calorie24`, {
          withCredentials: true,
        });
        setNutritions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setNutritions([]);  // Clear data if toggling to hide
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const viewNutrition = () => {
    navigate("/viewNutrition");
  };

  return (
    <Container>
      <Button type="submit" onClick={viewNutrition}>
        View All Nutrition
      </Button>
      <Button onClick={handleViewPastDay}>
        {showNutrition ? "Hide Nutrition from Past Day" : "View Nutrition from Past Day"}
      </Button>

      {showNutrition && nutritions.length > 0 ? (
        nutritions.map((nutrition) => (
          <NutritionCard key={nutrition._id}>
            <NutritionItem>Item: {nutrition.itemName}</NutritionItem>
            <NutritionItem>Quantity: {nutrition.itemQuantity}</NutritionItem>
            <NutritionItem>Calories: {nutrition.calories}</NutritionItem>
            <NutritionItem>Meal Type: {nutrition.mealType}</NutritionItem>
            <NutritionItem>
              Time: {new Date(nutrition.timeOfMeal).toLocaleString()}
            </NutritionItem>
          </NutritionCard>
        ))
      ) : (
        showNutrition && <p>No nutrition data available for this date.</p>
      )}

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <Label htmlFor="itemName">Item Name:</Label>
          <Input
            id="itemName"
            type="text"
            name="itemName"
            value={nutritionEntry.itemName}
            onChange={handleInputChange}
            placeholder="Item Name"
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="itemQuantity">Quantity:</Label>
          <Input
            id="itemQuantity"
            type="number"
            name="itemQuantity"
            value={nutritionEntry.itemQuantity}
            onChange={handleInputChange}
            placeholder="Quantity"
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="calories">Calories:</Label>
          <Input
            id="calories"
            type="number"
            name="calories"
            value={nutritionEntry.calories}
            onChange={handleInputChange}
            placeholder="Calories"
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="mealType">Meal Type:</Label>
          <select
            id="mealType"
            name="mealType"
            value={nutritionEntry.mealType}
            onChange={handleInputChange}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="others">Others</option>
          </select>
        </FormRow>
        <Button type="submit">Add Nutrition</Button>
      </Form>
    </Container>
  );
};

export default CalorieTracker;
