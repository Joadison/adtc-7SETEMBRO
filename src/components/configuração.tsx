"use client";

import { useState } from "react";
import EscalaWork from "./escalaWork";
import EscalaMensal from "./escalaMensal";
import { Button } from "./ui/button";
import EscalaOp from "./escalaOp";
/* import EscalaOp from "./escalaOp";*/

const Config = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigation = (component: any) => {
    setActiveComponent(component);
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center text-white p-2 bg-[#ff7f00] ">
        <Button variant="default" onClick={() => handleNavigation("EscalaWork")}>
          Escalas de Trabalhos
        </Button>
          <Button variant="default" onClick={() => handleNavigation("EscalaOp")}>
          Escala de Oportunidade
        </Button> 
          <Button variant="default" onClick={() => handleNavigation('Story')}>
          Escala Mensal
        </Button> 
      </div>

      <div className="relative overflow-auto">
        {activeComponent === "EscalaWork" && <EscalaWork />}
          {activeComponent === "EscalaOp" && <EscalaOp />} 
          {activeComponent === 'Story' && <EscalaMensal />} 
      </div>
    </>
  );
};

export default Config;
