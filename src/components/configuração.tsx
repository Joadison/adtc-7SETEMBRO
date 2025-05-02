"use client";

import { useState } from "react";
import EscalaWork from "./escalaWork";
/* import EscalaOp from "./escalaOp";*/

const Config = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigation = (component: any) => {
    setActiveComponent(component);
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center text-white p-4 bg-[#ff7f00] ">
        {/*  <Button variant="ghost" onClick={() => handleNavigation("EscalaWork")}>
          Escalas de Trabalhos
        </Button>
          <Button variant="ghost" onClick={() => handleNavigation("EscalaOp")}>
          Escala de Oportunidade
        </Button> 
          <Button variant="ghost" onClick={() => handleNavigation('Story')}>
          Criação de Story
        </Button> */}
      </div>

      <div className="relative overflow-auto">
          <EscalaWork />
      {/* {activeComponent === "EscalaWork" && <EscalaWork />}
          {activeComponent === "EscalaOp" && <EscalaOp />} 
          {activeComponent === 'Story' && <Story />} */}
      </div>
    </>
  );
};

export default Config;
