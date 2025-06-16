import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useNavigate } from "react-router-dom"

type HeaderProps = {
  onAddClick: () => void
}

export default function Header({ onAddClick }: HeaderProps) {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : { username: "User" }

  const username = user.username || "User"
  const initials = username
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-100 flex items-center justify-between w-full px-10 py-5 border-b bg-white dark:bg-zinc-900 shadow">
      <h1 className="text-2xl font-bold">📚 Learning Tracker</h1>

      <div className="flex items-center pr-6 gap-8">
        <Button className="w-28 h-10" onClick={onAddClick}>Add Goal</Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-12 h-12 border-1 border-black cursor-pointer">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
