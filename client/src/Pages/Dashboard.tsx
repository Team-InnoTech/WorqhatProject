import Header from '../components/page_comp/Header'
import GoalCard from '../components/page_comp/GoalCard'
import type { Goal } from '../types/goal';

function Dashboard() {
  const handleAddClick = () => {
    console.log("Add Goal");
  }

const dummyGoal: Goal[] = [
  {
    topic: "Learn TypeScript",
    status: "Intermediate",
    notes: ["Understand types", "Practice utility types"],
    resources: ["https://www.typescriptlang.org/docs", "https://tsplay.dev"],
    tags: ["typescript", "frontend", "practice"],
  },
  {
    topic: "Master React",
    status: "Advanced",
    notes: ["Learn hooks", "Understand context API", "Build projects"],
    resources: [
      "https://reactjs.org/docs/getting-started.html",
      "https://react.dev/learn",
    ],
    tags: ["react", "frontend", "projects"],
  }
];


  return (
    <div>
      <Header onAddClick={handleAddClick}></Header>
      <main className="flex flex-wrap gap-4 p-3 space-y-4">
        {dummyGoal.map((goal,idx)=> (
          <GoalCard
            key={idx}
            goal={goal}
            onDelete={() => console.log("Delete Clicked", goal.topic)}
            onEdit={() => console.log("Edit Clicked", goal.topic)}
          />
        ))}
      </main>
    </div>
  )
}

export default Dashboard
