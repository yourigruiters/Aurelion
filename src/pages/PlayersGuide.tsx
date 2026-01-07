import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border-light rounded-lg bg-bg-panel overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-bg-panel hover:bg-bg-main/50 transition-colors text-left"
      >
        <span className="font-semibold text-text-main">{question}</span>
        {isOpen ? (
          <ChevronDown size={20} className="text-accent" />
        ) : (
          <ChevronRight size={20} className="text-text-muted" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border-light bg-bg-main/30 text-text-secondary text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
};

const PlayersGuide: React.FC = () => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={32} className="text-brand" />
        <h1 className="text-3xl font-bold text-text-main">Players Guide</h1>
      </div>

      <div className="max-w-3xl space-y-4">
        <FAQItem
          question="How do I play Aurelion?"
          answer="Aurelion is a city-building and resource management game. Your goal is to grow your population, gather resources, construct buildings, and build a powerful military. Assign villagers to different jobs in the 'Population' tab to start gathering resources."
        />
        <FAQItem
          question="How do I get more villagers?"
          answer="Villagers will naturally arrive at your city over time if you have enough Housing capacity and Food. Monitor your daily food consumption and ensure you have enough 'Homestead' or higher-tier houses built in the 'Buildings' tab."
        />
        <FAQItem
          question="What happens when the day ends?"
          answer="Each in-game day lasts 30 minutes. At the end of the day, a 'Day Rollover' occurs. Food is consumed by your population, and daily reports are generated detailing events, resource changes, and activity outcomes."
        />
        <FAQItem
          question="How does the Military work?"
          answer="You can train warriors and other military units in the 'Military' tab. Assigning villagers as 'Warriors' increases your city's Attack Power. Defenses can be built to increase Defense Power. You can launch expeditions or defend against raids."
        />
        <FAQItem
          question="What are Activities?"
          answer="Activities are daily tasks you can perform for rewards. Some are safe community tasks, while others are risky expeditions outside the city walls. Check the 'Activities' tab daily for new opportunities."
        />
      </div>
    </div>
  );
};

export default PlayersGuide;
