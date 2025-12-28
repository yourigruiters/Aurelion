import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { tradeResource } from "../store/resourcesSlice";
import { RootState } from "../store/store";
import {
  Wheat,
  Mountain,
  Pickaxe,
  Hammer,
  Coins,
  LucideIcon,
  Apple,
  Users,
  ShoppingBag,
  BadgeDollarSign,
  ArrowRightLeft,
} from "lucide-react";
import Button from "../components/ui/Button"; // Assuming this exists from People.tsx context

interface TradeItem {
  id: string; // Resource key
  name: string;
  icon: LucideIcon;
  color: string;
  basePrice: number;
}

const TRADE_ITEMS: TradeItem[] = [
  {
    id: "population",
    name: "Population",
    icon: Users,
    color: "text-text-main",
    basePrice: 50,
  },
  {
    id: "food",
    name: "Food",
    icon: Apple,
    color: "text-danger-light",
    basePrice: 2,
  },
  {
    id: "wood",
    name: "Wood",
    icon: Wheat,
    color: "text-brand",
    basePrice: 2,
  },
  {
    id: "stone",
    name: "Stone",
    icon: Mountain,
    color: "text-text-muted",
    basePrice: 4,
  },
  {
    id: "iron",
    name: "Iron",
    icon: Hammer,
    color: "text-text-secondary",
    basePrice: 8,
  },
];

const Market: React.FC = () => {
  const dispatch = useDispatch();
  const { resources, population } = useSelector(
    (state: RootState) => state.resources
  );
  const gold = resources.gold;

  const handleTrade = (
    type: "buy" | "sell",
    item: TradeItem,
    amount: number
  ) => {
    const cost = item.basePrice * amount;
    dispatch(
      tradeResource({
        type,
        resource: item.id as any,
        amount,
        cost,
      })
    );
  };

  const CanAfford = (cost: number) => gold >= cost;
  const HasResource = (itemId: string, amount: number) => {
    if (itemId === "population") return population >= amount;
    // @ts-ignore
    return (resources[itemId] || 0) >= amount;
  };

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-xl border border-border-main bg-bg-panel">
        {/* Top Bar */}
        <div className="flex-none h-24 border-b border-border-main bg-bg-panel flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Market Hall</h1>
              <p className="text-sm text-text-secondary">Global Trading Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-bg-main px-6 py-3 rounded-lg border border-border-main">
            <span className="text-text-muted font-medium uppercase text-xs tracking-wider">
              Treasury
            </span>
            <div className="flex items-center gap-2">
              <Coins size={24} className="text-accent" />
              <span className="text-3xl font-bold text-text-main">{gold}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* SELLING SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BadgeDollarSign size={24} className="text-success" />
              <h2 className="text-2xl font-bold text-text-main">
                Sell Resources
              </h2>
              <span className="text-sm text-text-muted mt-1 ml-2">
                Exchange goods for Gold
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TRADE_ITEMS.map((item) => {
                const owned =
                  item.id === "population"
                    ? population
                    : resources[item.id as keyof typeof resources] || 0;
                return (
                  <div
                    key={`sell-${item.id}`}
                    className="flex items-center h-20 rounded-lg border border-border-light bg-bg-panel hover:border-border-active transition-colors px-4"
                  >
                    {/* Icon & Name */}
                    <div className="w-1/4 flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full bg-bg-main ${item.color}`}
                      >
                        <item.icon size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-text-main">
                          {item.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          Owned: {owned}
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 text-center border-l border-r border-border-main/50 px-4">
                      <span className="text-text-secondary text-sm">
                        Sell for{" "}
                      </span>
                      <span className="text-accent font-bold px-1">
                        {item.basePrice}
                      </span>
                      <span className="text-text-secondary text-sm">Gold</span>
                    </div>

                    {/* Actions */}
                    <div className="w-1/3 flex items-center justify-end gap-2 pl-4">
                      <Button
                        onClick={() => handleTrade("sell", item, 1)}
                        disabled={!HasResource(item.id, 1)}
                        variant="secondary"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Sell 1
                      </Button>
                      <Button
                        onClick={() => handleTrade("sell", item, 10)}
                        disabled={!HasResource(item.id, 10)}
                        variant="outline" // Less screamy than primary
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Sell 10
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BUYING SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ArrowRightLeft size={24} className="text-brand" />
              <h2 className="text-2xl font-bold text-text-main">
                Buy Resources
              </h2>
              <span className="text-sm text-text-muted mt-1 ml-2">
                Purchase goods with Gold
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TRADE_ITEMS.map((item) => {
                return (
                  <div
                    key={`buy-${item.id}`}
                    className="flex items-center h-20 rounded-lg border border-border-light bg-bg-panel hover:border-border-active transition-colors px-4"
                  >
                    {/* Icon & Name */}
                    <div className="w-1/4 flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full bg-bg-main ${item.color}`}
                      >
                        <item.icon size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-text-main">
                          {item.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          In Stock: ∞
                        </span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex-1 text-center border-l border-r border-border-main/50 px-4">
                      <span className="text-text-secondary text-sm">
                        Buy for{" "}
                      </span>
                      <span className="text-accent font-bold px-1">
                        {item.basePrice}
                      </span>
                      <span className="text-text-secondary text-sm">Gold</span>
                    </div>

                    {/* Actions */}
                    <div className="w-1/3 flex items-center justify-end gap-2 pl-4">
                      <Button
                        onClick={() => handleTrade("buy", item, 1)}
                        disabled={!CanAfford(item.basePrice)}
                        variant="secondary"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Buy 1
                      </Button>
                      <Button
                        onClick={() => handleTrade("buy", item, 10)}
                        disabled={!CanAfford(item.basePrice * 10)}
                        variant="outline"
                        className="px-4 py-1 text-sm bg-bg-main border border-border-main hover:bg-bg-dark"
                      >
                        Buy 10
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Market;
