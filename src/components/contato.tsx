"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Clock,
  Calendar,
  Instagram,
  Facebook,
  Youtube,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Contato = () => {
  const [formState, setFormState] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "Informações",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, assunto: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        nome: "",
        email: "",
        telefone: "",
        assunto: "Informações",
        mensagem: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Estamos à disposição para atendê-lo. Entre em contato conosco
            através dos canais abaixo ou preencha o formulário e retornaremos o
            mais breve possível.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl overflow-hidden border border-orange-200 mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Informações de Contato
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Endereço</h3>
                      <p className="text-gray-700">
                        Rua Santa Rita, 857 - Siqueira
                      </p>
                      <p className="text-gray-700">Fortaleza - CE, 60544-428</p>
                    </div>
                  </div>

                  {/*  <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Telefone</h3>
                      <p className="text-gray-700">(85) 4008-5200</p>
                    </div>
                  </div> */}

                  <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">E-mail</h3>
                      <p className="text-gray-700">
                        adtemplocentral7setembro1@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Horários de Atendimento
                      </h3>
                      <p className="text-gray-700">
                        Segunda a Sexta: 08:00h às 17:00h
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Redes Sociais
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/adtc.7setembro1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    {/*  <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a> */}
                    {/* <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Horários de Culto
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Cultos de Celebração
                      </h3>
                      <p className="text-gray-700">Domingo: 18:00h às 20:00h</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Cultos de Doutrina
                      </h3>
                      <p className="text-gray-700">
                        Quinta-feira: 19:00h às 21:00h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Escola Bíblica
                      </h3>
                      <p className="text-gray-700">Domingo: 08:00h às 10:00h</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Cultos das Senhoras
                      </h3>
                      <p className="text-gray-700">Todas as segundas-feiras do mês: 19:00h às 21:00h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Envie uma Mensagem
                  </h2>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                  >
                    <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-green-700">
                      Agradecemos seu contato. Retornaremos o mais breve
                      possível.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          name="nome"
                          placeholder="Digite seu nome completo"
                          value={formState.nome}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Digite seu e-mail"
                          value={formState.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          placeholder="(00) 00000-0000"
                          value={formState.telefone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Assunto</Label>
                        <RadioGroup
                          value={formState.assunto}
                          onValueChange={handleRadioChange}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Informações"
                              id="informacoes"
                            />
                            <Label htmlFor="informacoes">Informações</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Oração" id="oracao" />
                            <Label htmlFor="oracao">Pedido de Oração</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Visita" id="visita" />
                            <Label htmlFor="visita">Solicitar Visita</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Outro" id="outro" />
                            <Label htmlFor="outro">Outro</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="mensagem">Mensagem</Label>
                        <Textarea
                          id="mensagem"
                          name="mensagem"
                          placeholder="Digite sua mensagem"
                          rows={5}
                          value={formState.mensagem}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>  */}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Como Chegar</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 h-[400px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.1679767708584!2d-38.5899!3d-3.7899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDcnMjMuNiJTIDM4wrAzNScyMy42Ilc!5e0!3m2!1spt-BR!2sbr!4v1625761234567!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contato;
