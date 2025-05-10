import React, { useState, useContext, useEffect } from "react";
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

const WorkoutCard = styled.div`
  background-color: #fff;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExerciseList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ExerciseItem = styled.li`
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

const WorkoutList = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([
    { name: "", sets: 0, reps: 0, weight: 0 },
  ]);
  const [openDates, setOpenDates] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${URL}/workouts`, {
          withCredentials: true,
        });
        const flattenedWorkouts = response.data.flat();
        setWorkouts(flattenedWorkouts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [user]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newExercises = [...exercises];
    if (!newExercises[index]) {
      newExercises[index] = { name: "", sets: 0, reps: 0, weight: 0 };
    }
    newExercises[index][name] = value;
    setExercises(newExercises);
  };

  const handleSearch = async (event) => {
    if (event.target.value !== "") {
      const regex = new RegExp(`.*${event.target.value}.*`, "i"); // Use the search value

      // Flatten the exercises from all workouts
      const allExercises = workouts.flatMap((workout) => workout.exercises);

      const filteredExercises = allExercises.filter((item) =>
        regex.test(item.name)
      );

      filteredExercises.forEach((element) => {
        console.log(element);
      });
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: 0, reps: 0, weight: 0 }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${URL}/workouts`,
        {
          exercises,
          user: user.id,
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const workoutsByDate = workouts.reduce((acc, workout) => {
    const date = new Date(workout.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {});

  const viewWorkouts = () => {
    navigate("/viewWorkouts");
  };
  return (
    <Container>
      <Button type="submit" onClick={viewWorkouts}>
        View Workouts
      </Button>

      <Form onSubmit={handleSubmit}>
        {exercises.map((exercise, index) => (
          <FormRow key={index}>
            <Label htmlFor={`name-${index}`}>Exercise Name:</Label>
            <Input
              id={`name-${index}`}
              type="text"
              name="name"
              value={exercise.name}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Exercise Name"
            />
            <Label htmlFor={`sets-${index}`}>Sets:</Label>
            <Input
              id={`sets-${index}`}
              type="number"
              name="sets"
              value={exercise.sets}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Sets"
            />
            <Label htmlFor={`reps-${index}`}>Reps:</Label>
            <Input
              id={`reps-${index}`}
              type="number"
              name="reps"
              value={exercise.reps}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Reps"
            />
            <Label htmlFor={`weight-${index}`}>Weight:</Label>
            <Input
              id={`weight-${index}`}
              type="number"
              name="weight"
              value={exercise.weight}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Weight"
            />
          </FormRow>
        ))}
        <Button type="button" onClick={handleAddExercise}>
          Add Exercise
        </Button>
        <Button type="submit">Save Workout</Button>
      </Form>
    </Container>
  );
};

export default WorkoutList;
