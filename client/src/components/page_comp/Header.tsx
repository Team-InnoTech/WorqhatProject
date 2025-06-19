import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onAddClick: () => void;
};

export default function Header({ onAddClick }: HeaderProps) {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { username: "User" };

  const username = user.username || "User";
  const initials = username
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-10 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm">
      <h1 className="text-2xl font-bold">📚 Learning Tracker</h1>

      <div className="flex items-center gap-6">
        <Button
          className="w-28 h-10 rounded-lg font-semibold"
          onClick={onAddClick}
        >
          Add Goal
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-10 h-10 ring-1 ring-zinc-300 dark:ring-zinc-600 cursor-pointer transition hover:ring-blue-400">
              <AvatarFallback className="text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 rounded-md shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <DropdownMenuLabel className="text-center">
              {username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center justify-center cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}