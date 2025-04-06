import React, { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../../context/LanguageContext";

const AccordionWrapper = styled.div`
  width: 100%;
  max-width: 705px;
  margin: 0;
  padding: 0;
  @media (max-width: 992px) {
  margin: 0 auto;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 2px solid var(--text-color);
`;

const Question = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-top: 44px;
  font-size: clamp(18px, 2.4vw, 24px);
  cursor: pointer;
  background: ${({ $isOpen }) => ($isOpen ? "transparent" : "transparent")};
  width: 100%;
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  padding: 8px;
  font-size: clamp(18px, 2.4vw, 24px);
  background: transparent;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  width: 100%;
`;

const ExpandIcon = styled.span<{ $isOpen: boolean }>`
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease-in-out;
`;

const Accordion: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Данные для FAQ на разных языках
  const data = {
    EN: {
      questions: [
        { q: "Who is behind Nova Nit?", a: "Nova Nit is led by volunteers." },
        { q: "What’s in a Nova Nit Package?", a: "Essential food supplies." },
        { q: "How does Nova Nit choose which families to help?", a: "Based on need assessment." },
        { q: "How can my company get involved?", a: "By partnering with Nova Nit." },
        { q: "How do I learn about Nova Nit’s finances?", a: "Financial reports are online." },
        { q: "How can I start volunteering?", a: "Apply via the website." },
        { q: "Does Nova Nit take clothing donations?", a: "Yes, we accept used clothing." },
      ],
    },
    ME: {
      questions: [
        { q: "Ко стоји иза Nova Nit?", a: "Nova Nit воде волонтери." },
        { q: "Шта је у пакету Nova Nit?", a: "Основне намирнице." },
        { q: "Како бирамо породице за помоћ?", a: "На основу процене потреба." },
        { q: "Како моја фирма може помоћи?", a: "Можете постати партнер." },
        { q: "Где могу наћи финансијске извештаје?", a: "На нашем сајту." },
        { q: "Како могу постати волонтер?", a: "Пријавите се на веб-страници." },
        { q: "Да ли Nova Nit прима одећу?", a: "Да, примамо коришћену одећу." },
      ],
    },
  };

  const selectedData = data[language as keyof typeof data];

  return (
    <AccordionWrapper>
      {selectedData.questions.map((item, index) => (
        <AccordionItem key={index}>
          <Question $isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {item.q}
            <ExpandIcon $isOpen={openIndex === index}>▼</ExpandIcon>
          </Question>
          {openIndex === index && <Answer $isOpen={openIndex === index}>{item.a}</Answer>}
        </AccordionItem>
      ))}
    </AccordionWrapper>
  );
};

export default Accordion;
