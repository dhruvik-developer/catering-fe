import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TagCustomizer } from "../dishTagEngine/TagCustomizer";

export default function DishTagPdf() {
  const location = useLocation();
  const navigate = useNavigate();

  const { allDishes = [], settings = {}, session = {} } = location.state || {};

  useEffect(() => {
    if (!allDishes.length) navigate(-1);
  }, [allDishes, navigate]);

  const dishesArray = allDishes.map((name, index) => ({
    id: index + 1,
    name: typeof name === "string" ? name : name?.name || "Unknown",
    caterer: settings.catererName || "radha Catering",
  }));

  if (!allDishes.length) return null;

  return (
    <TagCustomizer
      dishes={dishesArray}
      onBack={() => navigate(-1)}
      sessionName={session?.event_time}
    />
  );
}
