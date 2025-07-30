"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function Main() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };
  return (
    <div className="flex-1 overflow-auto">
      <div className="relative w-full h-full">
        {/* Imagem e Apresentação */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative h-[79vh] overflow-hidden">
            <Image
              src="https://utfs.io/f/R1WGWTYNvh5qCYMA8pYH4EyDWJlihTzvtuRmKVpLg3jsBIa1"
              alt="Igreja AD Templo Central 7 de Setembro"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Amar, Acolher, Servir
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                Um lugar de restauração, alegria e paz
              </p>
            </div>
          </div>
        </section>
        {/* Time e Agenda Simples */}
        <section className="py-8 bg-orange-600 text-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="font-medium">Cultos - Domingo</p>
                  <p>18:00h às 20:00h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="font-medium">
                    Cultos de Doutrinas - Quinta-Feira
                  </p>
                  <p>19:00h às 21:00h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="font-medium">Escola Bíblica - Domingo</p>
                  <p>08:00h às 10:00h</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Apresentação da igreja */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* <div className="grid gap-12 items-center"> */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Bem-vindo à nossa igreja
                </h2>
                <p className="text-gray-600 mb-6">
                  A AD Templo Central - 7 de Setembro é uma comunidade de fé
                  comprometida em compartilhar o amor de Cristo através do
                  acolhimento, do serviço e da proclamação da Palavra de Deus.
                  Somos uma igreja que valoriza a família, a comunhão e o
                  crescimento espiritual.
                </p>
                <p className="text-gray-600 mb-6">
                  Nossa missão é levar a mensagem de esperança e salvação a
                  todas as pessoas, independentemente de sua origem ou condição
                  social. Acreditamos que todos são bem-vindos na casa do Senhor
                  e que cada pessoa tem um propósito especial no Reino de Deus.
                </p>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigateTo("/sobre-nos")}
                >
                  Conheça Nossa História
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
             <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://iiisjlgwrr.ufs.sh/f/R1WGWTYNvh5qIKED2uIk2C7LDvBRF5noXQ9qbMVm1ZKfjWPI"
                  alt="Comunidade da Igreja"
                  fill
                  className="object-cover"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Ministries */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossos Ministérios</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conheça as diversas áreas de atuação da nossa igreja e descubra
                como você pode se envolver e servir.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Ministério de Casais",
                  description:
                    "Fortalecendo lares com amor, fé e cumplicidade.",
                  icon: <Heart className="h-10 w-10 text-orange-600" />,
                },
                {
                  title: "Ministério Infantil",
                  description:
                    "Ensinando as crianças sobre o amor de Deus através de atividades lúdicas e educativas.",
                  icon: <Users className="h-10 w-10 text-orange-600" />,
                },
                {
                  title: "Ministério de Jovens",
                  description:
                    "Formando jovens comprometidos com Cristo através de estudos bíblicos e atividades sociais.",
                  icon: <UserPlus className="h-10 w-10 text-orange-600" />,
                },
              ].map((ministry, index) => (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4">{ministry.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{ministry.title}</h3>
                    <p className="text-gray-600 mb-4">{ministry.description}</p>
                    <Button
                      className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center"
                      onClick={() => navigateTo("/ministerios")}
                    >
                      Saiba mais
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => navigateTo("/ministerios")}
              >
                Ver Todos os Ministérios
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contribua com Amor</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Participe de nossas rifas online de forma rápida e segura.
                Escolha seus números da sorte e concorra a prêmio incrível!
              </p>
            </div>

            <div className="text-center mt-10">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  router.push("https://rifa-adtc-7setembro.vercel.app/")
                }
              >
                Participar agora
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Events Section */}
        {/*  <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Eventos</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                Fique por dentro das atividades e eventos especiais da nossa igreja
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                {
                    title: "Consagração de Jovens",
                    date: "05 de Abril, 2025",
                    time: "07:30h",
                    location: "7 de Setembro",
                },
                {
                    title: "Culto de Avivamento",
                    date: "05 de Abril, 2025",
                    time: "15:00h",
                    location: "7 de Setembro",
                },
                {
                    title: "Culto de Jovens",
                    date: "05 de Abril, 2025",
                    time: "18:00h",
                    location: "7 de Setembro",
                },
                ].map((event, index) => (
                <Card key={index} className="overflow-hidden">
                    <div className="h-48 relative">
                    <Image
                        src={`/placeholder.svg?height=400&width=600&text=Evento ${index + 1}`}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                    </div>
                    <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={()=> router.push("https://juventudetc7s1.vercel.app/")}>
                        Mais Informações
                    </Button>
                    </CardContent>
                </Card>
                ))}
            </div>
            <div className="text-center mt-10">
                <Button variant="outline" className="gap-2" onClick={() => router.push("https://calendar.google.com/calendar/ical/adtemplocentral7setembro1%40gmail.com/public/basic.ics")}>
                Ver Calendário Completo
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </section>*/}

        {/* Visitar! */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Venha nos Visitar</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Estamos ansiosos para recebê-lo em nossa comunidade. Venha
              experimentar o amor de Deus em um ambiente acolhedor e familiar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-orange-600 hover:bg-gray-100"
                onClick={() => router.push("https://bit.ly/enderecoadtc7stm")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Como Chegar
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

{
  /* Sermon Section */
}
{
  /* <section className="py-16 bg-gray-900 text-white">
    <div className="container">
    <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
        <Image
            src="/placeholder.svg?height=800&width=800&text=Pregação"
            alt="Pregação Recente"
            fill
            className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <Button size="icon" className="h-16 w-16 rounded-full bg-orange-600 hover:bg-orange-700">
            <Play className="h-8 w-8" />
            </Button>
        </div>
        </div>
        <div>
        <h2 className="text-3xl font-bold mb-6">Pregação Recente</h2>
        <h3 className="text-xl font-medium mb-2">O Poder da Fé em Tempos Difíceis</h3>
        <p className="text-gray-400 mb-6">Pastor João Silva - 25 de Junho, 2023</p>
        <p className="text-gray-300 mb-6">
            Nesta poderosa mensagem, o Pastor João nos ensina como manter nossa fé inabalável mesmo diante das
            maiores adversidades. Descubra como a Palavra de Deus pode ser sua âncora em tempos de tempestade.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
            <Play className="mr-2 h-4 w-4" />
            Assistir Agora
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
            Ver Todas as Pregações
            </Button>
        </div>
        </div>
    </div>
    </div>
</section> */
}
