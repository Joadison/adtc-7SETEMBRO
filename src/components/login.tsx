"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("auth", "true", { 
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        });
        
        router.push("/escala");
      } else {
        setError(data.error || "Senha incorreta");
      }
    } catch (err) {
      setError("Erro ao verificar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Acesso Restrito
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Digite a senha para acessar a escala
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="text-center"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Acessar Escala"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}