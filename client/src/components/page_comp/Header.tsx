import { Button } from "../ui/button";

type HeaderProps = {
    onAddClick:() => void;
}

export default function Header({onAddClick}: HeaderProps) {
    return (
        <header className= "sticky top-0 z-50 flex items-center justify-between w-full px-6 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm">
            <h1 className="text-2xl font-bold">📚 Learning Tracker</h1>
            <Button onClick={onAddClick}> Add Goal</Button>
        </header>
    );
}