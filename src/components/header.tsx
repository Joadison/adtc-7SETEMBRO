"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
/* import AudioPlayer from "./audio/AudioPlayer" */
import { Button } from "./ui/button"
import Link from "next/link"

const Header = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigateTo = (route: string) => {
    router.push(route)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* <AudioPlayer /> */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-20 items-center justify-between">
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

          <nav className="hidden md:flex gap-4">
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors"
              onClick={() => navigateTo("/em-que-cremos")}
            >
              Em que cremos?
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors"
              onClick={() => navigateTo("/sobre-nos")}
            >
              Sobre nós
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors"
              onClick={() => navigateTo("/ministerios")}
            >
              Ministérios
            </Button>
            <Button
              variant="default"
              className="text-sm font-medium hover:text-orange-600 hover:bg-transparent transition-colors"
              onClick={() => navigateTo("/cultos")}
            >
              Culto ao Vivo
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => navigateTo("/contato")}
            >
              Fale Conosco
            </Button>
            <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleMenu} />}

      {/* Mobile Menu */}
      <div
        className={`fixed top-20 left-0 right-0 bottom-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 h-full overflow-y-auto">
          <Button
            variant="default"
            className="justify-start text-lg font-medium hover:text-orange-600 hover:bg-orange-50 py-4"
            onClick={() => navigateTo("/em-que-cremos")}
          >
            Em que cremos?
          </Button>
          <Button
            variant="default"
            className="justify-start text-lg font-medium hover:text-orange-600 hover:bg-orange-50 py-4"
            onClick={() => navigateTo("/sobre-nos")}
          >
            Sobre nós
          </Button>
          <Button
            variant="default"
            className="justify-start text-lg font-medium hover:text-orange-600 hover:bg-orange-50 py-4"
            onClick={() => navigateTo("/ministerios")}
          >
            Ministérios
          </Button>
          <Button
            variant="default"
            className="justify-start text-lg font-medium hover:text-orange-600 hover:bg-orange-50 py-4"
            onClick={() => navigateTo("/cultos")}
          >
            Culto ao Vivo
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white mt-4" onClick={() => navigateTo("/contato")}>
            Fale Conosco
          </Button>
        </div>
      </div>
    </>
  )
}

export default Header

