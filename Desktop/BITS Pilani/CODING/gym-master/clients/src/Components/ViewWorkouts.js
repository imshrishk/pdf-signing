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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
const WorkoutList = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [openDates, setOpenDates] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${URL}/workouts`, {
          withCredentials: true,
        });
        const flattenedWorkouts = response.data.flat();
        setWorkouts(flattenedWorkouts);
        setFilteredExercises(flattenedWorkouts); // Set initial filteredExercises to all workouts
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [user]);

  const handleSearch = async (event) => {
    if (event.target.value !== "") {
      const regex = new RegExp(`.*${event.target.value}.*`, "i"); // Use the search value

      // Flatten the exercises from all workouts and filter them
      const filtered = workouts
        .map((workout) => ({
          date: workout.date,
          exercises: workout.exercises.filter((item) => regex.test(item.name)),
        }))
        .filter((workout) => workout.exercises.length > 0); // Only include workouts with matching exercises

      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(workouts); // Reset to all workouts if search is empty
    }
  };

  const handleToggleDate = (date) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const workoutsByDate = filteredExercises.reduce((acc, workout) => {
    const date = new Date(workout.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {});

  return (
    <Container>
      <form>
        <input
          type="text"
          placeholder="Filter"
          onChange={(e) => handleSearch(e)}
          required
        />
      </form>
      {Object.keys(workoutsByDate).length === 0 ? (
        <div>No exercises found</div>
      ) : (
        Object.keys(workoutsByDate).map((date) => (
          <div key={date}>
            <DateHeading onClick={() => handleToggleDate(date)}>
              {date}
            </DateHeading>
            {openDates[date] && (
              <ul>
                {workoutsByDate[date].map((workout) => (
                  <WorkoutCard key={workout._id}>
                    {workout.exercises && workout.exercises.length > 0 ? (
                      <h3>{workout.exercises[0].name}</h3>
                    ) : (
                      <h3>No exercises available</h3>
                    )}
                    <p>Exercises:</p>
                    <ExerciseList>
                      {workout.exercises &&
                        workout.exercises.map((exercise) => (
                          <ExerciseItem key={exercise._id}>
                            <strong>{exercise.name}</strong>
                            <p>Sets: {exercise.sets}</p>
                            <p>Reps: {exercise.reps}</p>
                            <p>Weight: {exercise.weight} KGS</p>
                          </ExerciseItem>
                        ))}
                    </ExerciseList>
                  </WorkoutCard>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </Container>
  );
};

export default WorkoutList;
