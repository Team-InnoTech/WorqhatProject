import React from 'react'

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuLink} from "../components/ui/navigation-menu"

import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();

  return (
    <div className='w-full shadow-sm px-6 py-3 gap-5 bg-white dark:bg-zinc-900'>
      <NavigationMenu>
        <NavigationMenuList className='flex gap-6 items-center'>
                <NavigationMenuLink asChild>
                    <button onClick={() => navigate("/")} className="text-lg font-semibold">
                     🧠 Learning Tracker
                    </button>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                    <button onClick={() => navigate("/")} className="text-lg font-semibold">
                     🧠 Learning Tracker
                    </button>
                </NavigationMenuLink>

                <NavigationMenuLink asChild>
                    <button onClick={() => navigate("/")} className="text-lg font-semibold">
                     🧠 Learning Tracker
                    </button>
                </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
