"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X, House, Church, User, HandHeart, MoreHorizontal, CalendarDays, Camera } from "lucide-react";
import { Button } from "./ui/button"
import Link from "next/link"

const Header = () => {
  const albumUrl = process.env.NEXT_PUBLIC_CURRENT_ALBUM_LINK;

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

  const navItems = [
    { label: "Em que cremos?", href: "/em-que-cremos" },
    { label: "Sobre nós", href: "/sobre-nos" },
    { label: "Ministérios", href: "/ministerios" },
    { label: "Culto ao Vivo", href: "/cultos" },
    { label: "Calendário", href: "/calendar" },
  ];
  
  const navButtonClass =
    "text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors p-1";

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
        <div className="hidden md:grid container mx-auto px-4 h-20 md:grid-cols-[1fr_auto_1fr] items-center">
          <Link href="/" className=" items-center gap-2 justify-self-start">
            <div className="w-auto h-12 cursor-pointer">
              <Image
                src="https://iiisjlgwrr.ufs.sh/f/c281d545-e49e-478e-ac64-7aa1327160e2-fqjls5.png"
                alt="7Setembro"
                width={200}
                height={48}
                className="object-contain h-full hidden lg:block"
              />
              <Image
                src="/favicon.png"
                alt="7Setembro"
                width={200}
                height={48}
                className="object-contain h-full block lg:hidden"
              />
            </div>
          </Link>
        
          <nav className="hidden md:flex items-center justify-self-center gap-0 md:gap-1 lg:gap-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="default"
                className={navButtonClass}
                onClick={() => navigateTo(item.href)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="default"
              className={navButtonClass}
              onClick={() =>
                window.open(
                  `https://photos.app.goo.gl/${albumUrl}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Fotos
            </Button>
          </nav>
        
          <div className="hidden lg:flex items-center gap-2 justify-self-end col-start-3 p-2">
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => navigateTo("/contato")}
            >
              Fale Conosco
            </Button>
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
                <Button
                  variant="default"
                  className="justify-start text-base font-medium hover:text-orange-600 hover:bg-orange-50 py-3"
                  onClick={() => window.open(`https://photos.app.goo.gl/${albumUrl}`,"_blank","noopener,noreferrer")}
                >
                  <Camera className="mr-3 h-5 w-5" />
                  Fotos
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