import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onAddClick: () => void;
};

export default function Header({ onAddClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-6 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm">
      <h1 className="text-2xl font-bold">📚 Learning Tracker</h1>

      <div className="flex items-center gap-4">
        <Button onClick={onAddClick}>Add Goal</Button>
        <Button
          variant="outline"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
