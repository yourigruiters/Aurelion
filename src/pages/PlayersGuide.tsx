import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface GuideSectionProps {
  title: string;
  content: React.ReactNode;
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border-light rounded-lg bg-bg-panel overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-bg-panel hover:bg-bg-main/50 transition-colors text-left"
      >
        <span className="font-semibold text-text-main text-lg">{title}</span>
        {isOpen ? (
          <ChevronDown size={20} className="text-accent" />
        ) : (
          <ChevronRight size={20} className="text-text-muted" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border-light bg-bg-main/30 text-text-secondary leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {content}
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
        <GuideSection
          title="The Path to Power: Player Level"
          content={
            <div className="space-y-2">
              <p>
                Your <strong>Player Level</strong> is the truest measure of your
                city's prestige. As you grow in level, the world reacts to your
                power.
              </p>
              <p>
                Increasing your level will significantly{" "}
                <strong>increase the rewards</strong> you receive from
                activities, allowing for faster growth. However, be warned: with
                great prestige comes great danger. The difficulty of activities,
                especially expeditions, will also scale with your level.
              </p>
            </div>
          }
        />

        <GuideSection
          title="Survival & Growth: Population"
          content={
            <div className="space-y-2">
              <p>
                Your people are the lifeblood of the city. Their survival
                depends entirely on <strong>Food</strong>. While other resources
                like Wood and Stone are crucial for construction, they are less
                critical for daily survival. If Food runs out, starvation will
                set in, and you will lose villagers.
              </p>
              <p>
                To grow your population, you must build and upgrade
                <strong> Houses</strong>, which can be purchased and managed
                market or construction queue. More advanced buildings will also
                provide better resource production rates, making your population
                more efficient.
              </p>
            </div>
          }
        />

        <GuideSection
          title="Venturing Forth: Activities"
          content={
            <div className="space-y-2">
              <p>
                While automated production is steady,{" "}
                <strong>Activities</strong> provide a burst of necessary
                resources. There are two categories:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>
                  <strong>Safe Tasks</strong>: Local community work with no
                  risk, providing modest rewards. The list refreshes daily.
                </li>
                <li>
                  <strong>Expeditions (Risky)</strong>: Ventures into the wild.
                  High rewards, but a failure can result in the loss of
                  population. You can only launch one expedition at a time, and
                  a new one becomes available only after the previous one
                  finishes.
                </li>
              </ul>
              <p>
                You can select one task from each category to run
                simultaneously. Choose wisely based on your current needs and
                military strength.
              </p>
            </div>
          }
        />

        <GuideSection
          title="Foundations of Industry: Buildings"
          content={
            <div className="space-y-2">
              <p>
                Buildings are the engines of your economy. Upgrading standard
                buildings increases the
                <strong> rate of return</strong> on resources for every assigned
                worker.
              </p>
              <p>
                Specialized buildings unlock new capabilities, such as the
                ability to house more people, train advanced units, or access
                new markets. Always look to upgrade your infrastructure to
                support a larger population.
              </p>
            </div>
          }
        />

        <GuideSection
          title="Commerce: The Market Hall"
          content={
            <div className="space-y-2">
              <p>
                The <strong>Market Hall</strong> is your hub for trade. Here,
                you can sell surplus goods for Gold or buy scarce materials
                needed for construction. It is also the place to purchase deeds
                for new Houses to expand your population cap.
              </p>
            </div>
          }
        />

        <GuideSection
          title="Defense & Conquest: Military"
          content={
            <div className="space-y-2">
              <p>
                A wealthy city is a target. The <strong>Military</strong> tab
                allows you to research new technologies to make your warriors
                more powerful.
              </p>
              <p>
                A strong military is essential for Risky Expeditions. A more
                powerful city can take on more dangerous threats and secure far
                greater rewards from the wilderness. Invest in your army to
                ensure your expeditions return successful and your people remain
                safe.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default PlayersGuide;
