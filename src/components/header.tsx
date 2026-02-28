"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X, House, Church, User, HandHeart, MoreHorizontal, CalendarDays } from "lucide-react";
import { Button } from "./ui/button"
import Link from "next/link"

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen)
  }

  const navigateTo = (route: string) => {
    router.push(route)
    setIsMenuOpen(false)
    setIsMoreMenuOpen(false)
  }

  const tabs = [
    { icon: House, label: "Início", path: "/" },
    { icon: Church, label: "Cultos", path: "/cultos" },
    { icon: HandHeart, label: "Em que cremos?", path: "/em-que-cremos" },
    { icon: MoreHorizontal, label: "Mais", path: "/mais", isMore: true},
  ];

  return (
    <>
      {/* <AudioPlayer /> */}
      <header className="sm:flex sticky hidden top-9 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex container h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-auto h-12 cursor-pointer">
              <Image
                src="https://iiisjlgwrr.ufs.sh/f/c281d545-e49e-478e-ac64-7aa1327160e2-fqjls5.png"
                alt="7Setembro"
                width={200}
                height={48}
                className="object-contain h-full"
              />
            </div>
          </Link>

          <nav className="hidden md:flex gap-0 lg:gap-9 md:gap-2">
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1"
              onClick={() => navigateTo("/em-que-cremos")}
            >
              Em que cremos?
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1"
              onClick={() => navigateTo("/sobre-nos")}
            >
              Sobre nós
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1"
              onClick={() => navigateTo("/ministerios")}
            >
              Ministérios
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1"
              onClick={() => navigateTo("/cultos")}
            >
              Culto ao Vivo
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1"
              onClick={() => navigateTo("/calendar")}
            >
              Calendário 
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => navigateTo("/contato")}
            >
              Fale Conosco
            </Button>
            {/* <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button> */}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleMenu} />}


       <nav className="md:hidden flex fixed bg-slate-100 bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-md mx-auto gap-1 w-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            
            if (tab.isMore) {
              return (
                <button
                  key={tab.path}
                  onClick={toggleMoreMenu}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 text-primary relative"
                >
                  <tab.icon size={22} strokeWidth={isMoreMenuOpen ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }
            
            return (
              <button
                key={tab.path}
                onClick={() => navigateTo(tab.path)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 text-primary"
              >
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* More Menu Overlay */}
      {isMoreMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleMoreMenu} />
          <div
            className={`fixed bottom-16 left-0 right-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden rounded-t-2xl shadow-lg`}
          >
            <div className="flex flex-col p-4 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center p-2 border-b">
                <h3 className="font-semibold text-lg">Menu</h3>
                <button onClick={toggleMoreMenu} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col space-y-1 py-2">
                <Button
                  variant="default"
                  className="justify-start text-base font-medium hover:text-orange-600 hover:bg-orange-50 py-3"
                  onClick={() => navigateTo("/sobre-nos")}
                >
                  <User className="mr-3 h-5 w-5" />
                  Sobre nós
                </Button>
                <Button
                  variant="default"
                  className="justify-start text-base font-medium hover:text-orange-600 hover:bg-orange-50 py-3"
                  onClick={() => navigateTo("/ministerios")}
                >
                  <Church className="mr-3 h-5 w-5" />
                  Ministérios
                </Button>
                <Button
                  variant="default"
                  className="justify-start text-base font-medium hover:text-orange-600 hover:bg-orange-50 py-3"
                  onClick={() => navigateTo("/calendar")}
                >
                  <CalendarDays className="mr-3 h-5 w-5" />
                  Calendário
                </Button>
                <div className="border-t my-2"></div>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white mt-2" 
                  onClick={() => navigateTo("/contato")}
                >
                  Fale Conosco
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header